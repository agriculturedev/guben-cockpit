using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class Add_DashboardTab_Column_EditorUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EditorUserId",
                schema: "Guben",
                table: "DashboardTab",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DashboardTab_EditorUserId",
                schema: "Guben",
                table: "DashboardTab",
                column: "EditorUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DashboardTab_EditorUserId",
                schema: "Guben",
                table: "DashboardTab");

            migrationBuilder.DropColumn(
                name: "EditorUserId",
                schema: "Guben",
                table: "DashboardTab");
        }
    }
}
