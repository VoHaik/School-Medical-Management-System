# Script to verify health declarations in the database
# You'll need to modify the DB connection details as needed

# Import required modules
Add-Type -Path "C:\Program Files (x86)\MySQL\MySQL Connector NET 8.0.33\MySql.Data.dll"

# Define database connection parameters (modify these as per your setup)
$server = "localhost"
$database = "healthschooldb"
$user = "root"
$password = "password" # Replace with your actual DB password

# Create connection
$connectionString = "Server=$server;Database=$database;Uid=$user;Pwd=$password;"
$connection = New-Object MySql.Data.MySqlClient.MySqlConnection($connectionString)

try {
    # Open connection
    $connection.Open()
    Write-Host "Connected to database successfully!" -ForegroundColor Green

    # Query to check all health declarations
    $query = "SELECT declaration_id, student_code, status, declaration_date, reviewed_at, reviewed_by_user_id, review_notes FROM health_declaration ORDER BY declaration_id"
    $command = New-Object MySql.Data.MySqlClient.MySqlCommand($query, $connection)
    $dataAdapter = New-Object MySql.Data.MySqlClient.MySqlDataAdapter($command)
    $dataTable = New-Object System.Data.DataTable
    $dataAdapter.Fill($dataTable)

    # Display results
    Write-Host "`nHealth Declarations in the database:" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Cyan
    
    if ($dataTable.Rows.Count -eq 0) {
        Write-Host "No health declarations found in the database." -ForegroundColor Yellow
    } else {
        Write-Host "Found $($dataTable.Rows.Count) health declaration(s)" -ForegroundColor Green
        
        foreach ($row in $dataTable.Rows) {
            Write-Host "`nDeclaration ID: $($row["declaration_id"])" -ForegroundColor White
            Write-Host "  Student Code: $($row["student_code"])" -ForegroundColor White
            Write-Host "  Status: $($row["status"])" -ForegroundColor $(
                if ($row["status"] -eq "PENDING") { "Yellow" }
                elseif ($row["status"] -eq "APPROVED") { "Green" }
                elseif ($row["status"] -eq "REJECTED") { "Red" }
                else { "White" }
            )
            Write-Host "  Declaration Date: $($row["declaration_date"])" -ForegroundColor White
            Write-Host "  Reviewed At: $($row["reviewed_at"] -as [string])" -ForegroundColor White
            Write-Host "  Reviewed By: $($row["reviewed_by_user_id"] -as [string])" -ForegroundColor White
            Write-Host "  Review Notes: $($row["review_notes"] -as [string])" -ForegroundColor White
        }
    }

    # Query for counts by status
    $query = "SELECT status, COUNT(*) as count FROM health_declaration GROUP BY status"
    $command.CommandText = $query
    $dataAdapter = New-Object MySql.Data.MySqlClient.MySqlDataAdapter($command)
    $dataTable = New-Object System.Data.DataTable
    $dataAdapter.Fill($dataTable)

    Write-Host "`nHealth Declaration Counts by Status:" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Cyan
    
    if ($dataTable.Rows.Count -eq 0) {
        Write-Host "No status data found." -ForegroundColor Yellow
    } else {
        foreach ($row in $dataTable.Rows) {
            $status = $row["status"] -as [string]
            if ([string]::IsNullOrEmpty($status)) {
                $status = "NULL"
            }
            Write-Host "$status : $($row["count"])" -ForegroundColor $(
                if ($status -eq "PENDING") { "Yellow" }
                elseif ($status -eq "APPROVED") { "Green" }
                elseif ($status -eq "REJECTED") { "Red" }
                else { "White" }
            )
        }
    }

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
} finally {
    # Close connection
    if ($connection.State -eq 'Open') {
        $connection.Close()
        Write-Host "`nDatabase connection closed." -ForegroundColor Green
    }
}
