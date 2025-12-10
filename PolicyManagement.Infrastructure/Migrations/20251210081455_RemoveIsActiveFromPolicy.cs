using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PolicyManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsActiveFromPolicy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Policies_IsActive",
                table: "Policies");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Policies");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Policies",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Policies_IsActive",
                table: "Policies",
                column: "IsActive");
        }
    }
}
