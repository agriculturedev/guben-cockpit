using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrations.Migrations
{
    /// <inheritdoc />
    public partial class AddIdToEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
              name: "EventId",
              schema: "Guben",
              table: "Url");

            migrationBuilder.DropColumn(
              name: "EventsId",
              schema: "Guben",
              table: "EventCategory");

            migrationBuilder.DropColumn(
              name: "Id",
              schema: "Guben",
              table: "Event");

            migrationBuilder.AddColumn<Guid>(
              name: "EventId",
              schema: "Guben",
              table: "Url",
              type: "uuid",
              nullable: false);

            migrationBuilder.AddColumn<Guid>(
              name: "EventsId",
              schema: "Guben",
              table: "EventCategory",
              type: "uuid",
              nullable: false);

            migrationBuilder.AddColumn<Guid>(
              name: "Id",
              schema: "Guben",
              table: "Event",
              type: "uuid",
              nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "EventId",
                schema: "Guben",
                table: "Event",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Event_EventId",
                schema: "Guben",
                table: "Event",
                column: "EventId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Event_EventId",
                schema: "Guben",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "EventId",
                schema: "Guben",
                table: "Event");

            migrationBuilder.AlterColumn<int>(
                name: "EventId",
                schema: "Guben",
                table: "Url",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<int>(
                name: "EventsId",
                schema: "Guben",
                table: "EventCategory",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                schema: "Guben",
                table: "Event",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");
        }
    }
}
