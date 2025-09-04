using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class Create_DashboardDropdown_Add_Tab_DropdownId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DropdownId",
                schema: "Guben",
                table: "DashboardTab",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DashboardDropdown",
                schema: "Guben",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Translations = table.Column<string>(type: "jsonb", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: true),
                    Rank = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DashboardDropdown", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DashboardTab_DropdownId_Sequence",
                schema: "Guben",
                table: "DashboardTab",
                columns: new[] { "DropdownId", "Sequence" });

            migrationBuilder.CreateIndex(
                name: "IX_DashboardDropdown_Rank",
                schema: "Guben",
                table: "DashboardDropdown",
                column: "Rank");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DashboardTab_DashboardDropdown_DropdownId",
                schema: "Guben",
                table: "DashboardTab");

            migrationBuilder.DropTable(
                name: "DashboardDropdown",
                schema: "Guben");

            migrationBuilder.DropIndex(
                name: "IX_DashboardTab_DropdownId_Sequence",
                schema: "Guben",
                table: "DashboardTab");

            migrationBuilder.DropColumn(
                name: "DropdownId",
                schema: "Guben",
                table: "DashboardTab");
        }
    }
}
