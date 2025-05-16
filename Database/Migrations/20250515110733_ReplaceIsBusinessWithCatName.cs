using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceIsBusinessWithCatName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CatName",
                schema: "Guben",
                table: "Project",
                type: "text",
                nullable: true);

            migrationBuilder.Sql(@"
                UPDATE ""Guben"".""Project""
                SET ""CatName"" = CASE
                    WHEN ""IsBusiness"" = TRUE THEN 'Gubener Marktplatz'
                    ELSE 'Stadtentwicklung'
                END");
            
            migrationBuilder.AlterColumn<string>(
                name: "CatName",
                schema: "Guben",
                table: "Project",
                type: "text",
                nullable: false,
                defaultValue: "Gubener Marktplatz",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "IsBusiness",
                schema: "Guben",
                table: "Project");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CatName",
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
