#define MyAppName "Currency Exchange System"
#define MyAppVersion "1.0"
#define MyAppPublisher "Samiullah Farahi"
#define MyAppExeName "start.bat"

[Setup]
AppId={{5FDE3D92-6C12-4B10-9A77-8A6C5F2B7E11}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}

DefaultDirName=C:\CurrencyExchange

DefaultGroupName=Currency Exchange

OutputDir=Output

OutputBaseFilename=CurrencyExchangeSetup

Compression=lzma

SolidCompression=yes

WizardStyle=modern

PrivilegesRequired=admin

SetupIconFile=C:\Users\Samiullah\Desktop\CurrencyExchange\currency_icon.ico

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]

Source: "C:\Users\Samiullah\Desktop\CurrencyExchange\financial-system-0.0.1-SNAPSHOT.jar"; DestDir: "{app}"; Flags: ignoreversion

Source: "C:\Users\Samiullah\Desktop\CurrencyExchange\application.properties"; DestDir: "{app}"; Flags: ignoreversion

Source: "C:\Users\Samiullah\Desktop\CurrencyExchange\start.bat"; DestDir: "{app}"; Flags: ignoreversion

[Dirs]
Name: "{app}\uploads"
Name: "{app}\uploads\logos"
Name: "{app}\Backups"



[Icons]

Name: "{group}\Currency Exchange"; Filename: "{app}\start.bat"

Name: "{autodesktop}\Currency Exchange"; Filename: "{app}\start.bat"

[Run]

Filename: "{app}\start.bat"; Description: "Launch Currency Exchange"; Flags: nowait postinstall skipifsilent