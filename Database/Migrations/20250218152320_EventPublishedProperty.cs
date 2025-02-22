using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class EventPublishedProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Published",
                schema: "Guben",
                table: "Event",
                type: "boolean",
                nullable: true);

            migrationBuilder.Sql(@"
              UPDATE ""Guben"".""Event""
              SET ""Published"" = true
            ");

            migrationBuilder.AlterColumn<bool>(
              name: "Published",
              schema: "Guben",
              table: "Event",
              type: "boolean",
              nullable: false
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Published",
                schema: "Guben",
                table: "Event");
        }
    }
}
