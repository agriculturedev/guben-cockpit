using Domain.Events;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class TranslatedEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Translations",
                schema: "Guben",
                table: "Event",
                type: "jsonb",
                nullable: true);

            // migrationBuilder.Sql(@"
            //   UPDATE ""Guben"".""Event""
            //   SET ""Translations"" = jsonb_build_object(
            //     'de',
            //     jsonb_build_object(
            //       'Title', ""Title"",
            //       'Description', ""Description""
            //     )
            //   )
            // ");
            // the above would be better if we actually wanted to keep any old or user added data, just yeet old stuff for now

            migrationBuilder.Sql(@"
              DELETE FROM ""Guben"".""Event""
            ");

            migrationBuilder.AlterColumn<Dictionary<string, EventI18NData>>(
              name: "Translations",
              schema: "Guben",
              table: "Event",
              type: "jsonb",
              nullable: false);

            migrationBuilder.DropColumn(
              name: "Description",
              schema: "Guben",
              table: "Event");

            migrationBuilder.DropColumn(
              name: "Title",
              schema: "Guben",
              table: "Event");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                schema: "Guben",
                table: "Event");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "Guben",
                table: "Event",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                schema: "Guben",
                table: "Event",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
