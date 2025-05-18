using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class TranslatedDashboardCards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          migrationBuilder.AddColumn<string>(
            name: "Translations",
            schema: "Guben",
            table: "InformationCard",
            type: "jsonb",
            nullable: false,
            defaultValue: "");

          migrationBuilder.Sql(@"
            UPDATE ""Guben"".""InformationCard""
            SET ""Translations"" = jsonb_build_object(
              'de',
              jsonb_build_object(
                'Title', ""Title"",
                'ImageAlt', ""ImageAlt"",
                'Description', ""Description""
              )
            )
          ");

            migrationBuilder.DropColumn(
                name: "Description",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.DropColumn(
                name: "ImageAlt",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.DropColumn(
                name: "Title",
                schema: "Guben",
                table: "InformationCard");


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageAlt",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);
        }
    }
}
