using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrations.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                schema: "Guben",
                table: "Project",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.InsertData(
                schema: "Guben",
                table: "User",
                columns: new[] { "Id", "Email", "FirstName", "KeycloakId", "LastName" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000000"), "system@example.com", "System", "system", "User" });

            migrationBuilder.CreateIndex(
                name: "IX_Project_CreatedBy",
                schema: "Guben",
                table: "Project",
                column: "CreatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_Project_User_CreatedBy",
                schema: "Guben",
                table: "Project",
                column: "CreatedBy",
                principalSchema: "Guben",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Project_User_CreatedBy",
                schema: "Guben",
                table: "Project");

            migrationBuilder.DropIndex(
                name: "IX_Project_CreatedBy",
                schema: "Guben",
                table: "Project");

            migrationBuilder.DeleteData(
                schema: "Guben",
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Guben",
                table: "Project");
        }
    }
}
