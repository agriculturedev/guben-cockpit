using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class FixEventCategoryKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""Guben"".""EventCategory""");

            migrationBuilder.DropForeignKey(
                name: "FK_EventCategory_Category_CategoriesId",
                schema: "Guben",
                table: "EventCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_EventCategory_Event_EventsId",
                schema: "Guben",
                table: "EventCategory");

            migrationBuilder.RenameColumn(
                name: "EventsId",
                schema: "Guben",
                table: "EventCategory",
                newName: "EventId");

            migrationBuilder.RenameColumn(
                name: "CategoriesId",
                schema: "Guben",
                table: "EventCategory",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_EventCategory_EventsId",
                schema: "Guben",
                table: "EventCategory",
                newName: "IX_EventCategory_EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventCategory_CategoryId",
                schema: "Guben",
                table: "EventCategory",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventCategory_Category_CategoryId",
                schema: "Guben",
                table: "EventCategory",
                column: "CategoryId",
                principalSchema: "Guben",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventCategory_Event_EventId",
                schema: "Guben",
                table: "EventCategory",
                column: "EventId",
                principalSchema: "Guben",
                principalTable: "Event",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventCategory_Category_CategoryId",
                schema: "Guben",
                table: "EventCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_EventCategory_Event_EventId",
                schema: "Guben",
                table: "EventCategory");

            migrationBuilder.DropIndex(
                name: "IX_EventCategory_CategoryId",
                schema: "Guben",
                table: "EventCategory");

            migrationBuilder.RenameColumn(
                name: "EventId",
                schema: "Guben",
                table: "EventCategory",
                newName: "EventsId");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                schema: "Guben",
                table: "EventCategory",
                newName: "CategoriesId");

            migrationBuilder.RenameIndex(
                name: "IX_EventCategory_EventId",
                schema: "Guben",
                table: "EventCategory",
                newName: "IX_EventCategory_EventsId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventCategory_Category_CategoriesId",
                schema: "Guben",
                table: "EventCategory",
                column: "CategoriesId",
                principalSchema: "Guben",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventCategory_Event_EventsId",
                schema: "Guben",
                table: "EventCategory",
                column: "EventsId",
                principalSchema: "Guben",
                principalTable: "Event",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
