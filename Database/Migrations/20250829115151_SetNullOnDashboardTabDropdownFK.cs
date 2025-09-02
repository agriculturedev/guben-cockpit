using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class SetNullOnDashboardTabDropdownFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DashboardTab_DashboardDropdown_DropdownId",
                schema: "Guben",
                table: "DashboardTab");

            migrationBuilder.AddForeignKey(
                name: "FK_DashboardTab_DashboardDropdown_DropdownId",
                schema: "Guben",
                table: "DashboardTab",
                column: "DropdownId",
                principalSchema: "Guben",
                principalTable: "DashboardDropdown",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DashboardTab_DashboardDropdown_DropdownId",
                schema: "Guben",
                table: "DashboardTab");

            migrationBuilder.AddForeignKey(
                name: "FK_DashboardTab_DashboardDropdown_DropdownId",
                schema: "Guben",
                table: "DashboardTab",
                column: "DropdownId",
                principalSchema: "Guben",
                principalTable: "DashboardDropdown",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
