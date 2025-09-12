using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class Update_DashboardDropdown_Column_IsLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Link",
                schema: "Guben",
                table: "DashboardDropdown");

            migrationBuilder.AddColumn<bool>(
                name: "IsLink",
                schema: "Guben",
                table: "DashboardDropdown",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLink",
                schema: "Guben",
                table: "DashboardDropdown");

            migrationBuilder.AddColumn<string>(
                name: "Link",
                schema: "Guben",
                table: "DashboardDropdown",
                type: "text",
                nullable: true);
        }
    }
}
