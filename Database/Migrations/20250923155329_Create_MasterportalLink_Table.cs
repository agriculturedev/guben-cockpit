using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class Create_MasterportalLink_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MasterportalLink",
                schema: "Guben",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by_user_id = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: true),
                    updated_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by_user_id = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: true),
                    status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    review_note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    url = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    folder = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    type = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    wms_layers = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    wms_format = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    wms_version = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    wms_gfi_theme = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    wms_max_scale = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    wms_min_scale = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    wms_tile_size = table.Column<int>(type: "integer", nullable: true),
                    wms_legend_url = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    wms_supported = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    wms_visibility = table.Column<bool>(type: "boolean", nullable: true),
                    wms_transparent = table.Column<bool>(type: "boolean", nullable: true),
                    wms_feature_count = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: true),
                    wms_transparency = table.Column<int>(type: "integer", nullable: true),
                    wms_gfi_attributes = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    wms_layer_attribution = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    wfs_feature_type = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    wfs_feature_ns = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    wfs_version = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterportalLink", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_masterportal_links_created_at",
                schema: "Guben",
                table: "MasterportalLink",
                column: "created_at_utc");

            migrationBuilder.CreateIndex(
                name: "ix_masterportal_links_folder",
                schema: "Guben",
                table: "MasterportalLink",
                column: "folder");

            migrationBuilder.CreateIndex(
                name: "ix_masterportal_links_status_type",
                schema: "Guben",
                table: "MasterportalLink",
                columns: new[] { "status", "type" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MasterportalLink",
                schema: "Guben");
        }
    }
}
