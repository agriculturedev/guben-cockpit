using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class WmsWfsTopics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Topic",
                schema: "Guben",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topic", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DataSource",
                schema: "Guben",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    TopicId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataSource", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DataSource_Topic_TopicId",
                        column: x => x.TopicId,
                        principalSchema: "Guben",
                        principalTable: "Topic",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Source",
                schema: "Guben",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    DataSourceId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Source", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Source_DataSource_DataSourceId",
                        column: x => x.DataSourceId,
                        principalSchema: "Guben",
                        principalTable: "DataSource",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DataSource_TopicId",
                schema: "Guben",
                table: "DataSource",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_Source_DataSourceId",
                schema: "Guben",
                table: "Source",
                column: "DataSourceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Source",
                schema: "Guben");

            migrationBuilder.DropTable(
                name: "DataSource",
                schema: "Guben");

            migrationBuilder.DropTable(
                name: "Topic",
                schema: "Guben");
        }
    }
}
