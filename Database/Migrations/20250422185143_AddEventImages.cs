using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class AddEventImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventImages",
                schema: "Guben",
                columns: table => new
                {
                    OriginalUrl = table.Column<string>(type: "text", nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "text", nullable: false),
                    PreviewUrl = table.Column<string>(type: "text", nullable: false),
                    Width = table.Column<int>(type: "integer", nullable: true),
                    Height = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventImages", x => new { x.EventId, x.OriginalUrl });
                    table.ForeignKey(
                        name: "FK_EventImages_Event_EventId",
                        column: x => x.EventId,
                        principalSchema: "Guben",
                        principalTable: "Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventImages",
                schema: "Guben");
        }
    }
}
