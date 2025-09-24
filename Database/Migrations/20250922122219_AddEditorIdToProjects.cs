using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class AddEditorIdToProjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EditorId",
                schema: "Guben",
                table: "Project",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Project_EditorId",
                schema: "Guben",
                table: "Project",
                column: "EditorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Project_User_EditorId",
                schema: "Guben",
                table: "Project",
                column: "EditorId",
                principalSchema: "Guben",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Project_User_EditorId",
                schema: "Guben",
                table: "Project");

            migrationBuilder.DropIndex(
                name: "IX_Project_EditorId",
                schema: "Guben",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "EditorId",
                schema: "Guben",
                table: "Project");
        }
    }
}
