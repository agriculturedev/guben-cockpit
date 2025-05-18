using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class AddButtonTranslations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          migrationBuilder.AddColumn<string>(
            name: "Button_Translations",
            schema: "Guben",
            table: "InformationCard",
            type: "jsonb",
            nullable: true);

          migrationBuilder.Sql(@"
            UPDATE ""Guben"".""InformationCard""
            SET ""Button_Translations"" = jsonb_build_object(
              'de',
              jsonb_build_object(
                'Title', ""Button_Title"",
                'Url', ""Button_Url""
              )
            )
          ");

            migrationBuilder.DropColumn(
                name: "Button_Title",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.DropColumn(
                name: "Button_Url",
                schema: "Guben",
                table: "InformationCard");


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Button_Translations",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.AddColumn<string>(
                name: "Button_Title",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Button_Url",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);
        }
    }
}
