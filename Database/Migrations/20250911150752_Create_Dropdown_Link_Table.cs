using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class Create_Dropdown_Link_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DropdownLink",
                schema: "Guben",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Translations = table.Column<string>(type: "jsonb", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: false),
                    Sequence = table.Column<int>(type: "integer", nullable: false),
                    DropdownId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DropdownLink", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DropdownLink_DashboardDropdown_DropdownId",
                        column: x => x.DropdownId,
                        principalSchema: "Guben",
                        principalTable: "DashboardDropdown",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DropdownLink_DropdownId_Sequence",
                schema: "Guben",
                table: "DropdownLink",
                columns: new[] { "DropdownId", "Sequence" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DropdownLink",
                schema: "Guben");
        }
    }
}
