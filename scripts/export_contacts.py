import subprocess

# AppleScript to export contacts to CSV
apple_script = """
set outputFile to (path to desktop as text) & "ContactsExport.csv"

tell application "Contacts"
 set thePeople to people
 set csvData to "First Name, Last Name, Email, Phone Number" & return

 repeat with aPerson in thePeople
 set firstName to first name of aPerson as text
 set lastName to last name of aPerson as text
 set emails to value of email of aPerson as text
 set phones to value of phone of aPerson as text

 set csvData to csvData & firstName & "," & lastName & "," & emails & "," & phones & return
 end repeat
end tell

-- Write to the CSV file
do shell script "echo " & quoted form of csvData & " > " & quoted form of POSIX path of outputFile
"""

# Run the AppleScript
subprocess.run(["osascript", "-e", apple_script])

print("Contacts exported successfully to ContactsExport.csv on your desktop.")
