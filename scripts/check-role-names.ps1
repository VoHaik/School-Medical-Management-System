# Script to check role names in the database
# This script checks the role_name values in the Roles table

param (
    [string]$Server = "localhost",
    [string]$Database = "HealthSchoolDB",
    [string]$Username = "sa",
    [string]$Password = "123456"
)

# Query to check role names
$roleQuery = @"
SELECT role_id, role_name, description FROM Roles ORDER BY role_id;
"@

# Run the query
Write-Host "Checking role names in the database..."
Write-Host "Running query: $roleQuery"
sqlcmd -S $Server -U $Username -P $Password -d $Database -Q $roleQuery
Write-Host "Query complete."
