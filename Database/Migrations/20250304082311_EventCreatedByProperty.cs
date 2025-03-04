using System;
using Domain.Users;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class EventCreatedByProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                schema: "Guben",
                table: "Event",
                type: "uuid",
                nullable: false,
                defaultValue: User.SystemUserId);

            migrationBuilder.CreateIndex(
                name: "IX_Event_CreatedBy",
                schema: "Guben",
                table: "Event",
                column: "CreatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_User_CreatedBy",
                schema: "Guben",
                table: "Event",
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
                name: "FK_Event_User_CreatedBy",
                schema: "Guben",
                table: "Event");

            migrationBuilder.DropIndex(
                name: "IX_Event_CreatedBy",
                schema: "Guben",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Guben",
                table: "Event");
        }
    }
}
