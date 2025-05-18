using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProjectType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                schema: "Guben",
                table: "Project",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"
                UPDATE ""Guben"".""Project""
                SET ""Type"" = CASE
                    WHEN ""IsBusiness"" = TRUE THEN 0
                    ELSE 1
                END");

            migrationBuilder.DropColumn(
              name: "IsBusiness",
              schema: "Guben",
              table: "Project");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                schema: "Guben",
                table: "Project");

            migrationBuilder.AddColumn<bool>(
                name: "IsBusiness",
                schema: "Guben",
                table: "Project",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
