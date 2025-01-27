using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrations.Migrations
{
    /// <inheritdoc />
    public partial class AddTerminIdToEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Event_EventId",
                schema: "Guben",
                table: "Event");

            migrationBuilder.AddColumn<string>(
                name: "TerminId",
                schema: "Guben",
                table: "Event",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Event_EventId_TerminId",
                schema: "Guben",
                table: "Event",
                columns: new[] { "EventId", "TerminId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Event_EventId_TerminId",
                schema: "Guben",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "TerminId",
                schema: "Guben",
                table: "Event");

            migrationBuilder.CreateIndex(
                name: "IX_Event_EventId",
                schema: "Guben",
                table: "Event",
                column: "EventId",
                unique: true);
        }
    }
}
