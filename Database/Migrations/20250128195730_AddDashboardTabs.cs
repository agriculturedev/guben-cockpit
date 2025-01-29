using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class AddDashboardTabs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DashboardTab",
                schema: "Guben",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Sequence = table.Column<int>(type: "integer", nullable: false),
                    MapUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DashboardTab", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InformationCard",
                schema: "Guben",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Button_Title = table.Column<string>(type: "text", nullable: true),
                    Button_Url = table.Column<string>(type: "text", nullable: true),
                    Button_OpenInNewTab = table.Column<bool>(type: "boolean", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    ImageAlt = table.Column<string>(type: "text", nullable: true),
                    DashboardTabId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InformationCard", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InformationCard_DashboardTab_DashboardTabId",
                        column: x => x.DashboardTabId,
                        principalSchema: "Guben",
                        principalTable: "DashboardTab",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InformationCard_DashboardTabId",
                schema: "Guben",
                table: "InformationCard",
                column: "DashboardTabId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InformationCard",
                schema: "Guben");

            migrationBuilder.DropTable(
                name: "DashboardTab",
                schema: "Guben");
        }
    }
}
