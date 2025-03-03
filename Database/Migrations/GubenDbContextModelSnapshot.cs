﻿// <auto-generated />
using System;
using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Database.Migrations
{
    [DbContext(typeof(GubenDbContext))]
    partial class GubenDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("Guben")
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Domain.Category.Category", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<int>("CategoryId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Category", "Guben");
                });

            modelBuilder.Entity("Domain.DashboardTab.DashboardTab", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("MapUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Sequence")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("DashboardTab", "Guben");
                });

            modelBuilder.Entity("Domain.Events.Event", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("Coordinates")
                        .HasColumnType("text");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("EventId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("LocationId")
                        .HasColumnType("uuid");

                    b.Property<bool>("Published")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("TerminId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Translations")
                        .IsRequired()
                        .HasColumnType("jsonb");

                    b.HasKey("Id");

                    b.HasIndex("LocationId");

                    b.HasIndex("EventId", "TerminId");

                    b.ToTable("Event", "Guben");
                });

            modelBuilder.Entity("Domain.Locations.Location", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("City")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("Fax")
                        .HasColumnType("text");

                    b.Property<string>("Street")
                        .HasColumnType("text");

                    b.Property<string>("TelephoneNumber")
                        .HasColumnType("text");

                    b.Property<string>("Translations")
                        .IsRequired()
                        .HasColumnType("jsonb");

                    b.Property<string>("Website")
                        .HasColumnType("text");

                    b.Property<string>("Zip")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Location", "Guben");
                });

            modelBuilder.Entity("Domain.Pages.Page", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("Translations")
                        .IsRequired()
                        .HasColumnType("jsonb");

                    b.HasKey("Id");

                    b.ToTable("Page", "Guben");
                });

            modelBuilder.Entity("Domain.Projects.Project", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<Guid>("CreatedBy")
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("FullText")
                        .HasColumnType("text");

                    b.Property<string>("ImageCaption")
                        .HasColumnType("text");

                    b.Property<string>("ImageCredits")
                        .HasColumnType("text");

                    b.Property<string>("ImageUrl")
                        .HasColumnType("text");

                    b.Property<bool>("Published")
                        .HasColumnType("boolean");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.ToTable("Project", "Guben");
                });

            modelBuilder.Entity("Domain.Users.User", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("KeycloakId")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.ToTable("User", "Guben");

                    b.HasData(
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000000"),
                            Email = "system@example.com",
                            FirstName = "System",
                            KeycloakId = "system",
                            LastName = "User"
                        });
                });

            modelBuilder.Entity("EventCategory", b =>
                {
                    b.Property<Guid>("CategoriesId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("EventsId")
                        .HasColumnType("uuid");

                    b.HasKey("CategoriesId", "EventsId");

                    b.HasIndex("CategoriesId");

                    b.HasIndex("EventsId");

                    b.ToTable("EventCategory", "Guben");
                });

            modelBuilder.Entity("Domain.DashboardTab.DashboardTab", b =>
                {
                    b.OwnsMany("Domain.DashboardTab.InformationCard", "InformationCards", b1 =>
                        {
                            b1.Property<Guid>("Id")
                                .HasColumnType("uuid");

                            b1.Property<Guid>("DashboardTabId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Description")
                                .HasColumnType("text");

                            b1.Property<string>("ImageAlt")
                                .HasColumnType("text");

                            b1.Property<string>("ImageUrl")
                                .HasColumnType("text");

                            b1.Property<string>("Title")
                                .HasColumnType("text");

                            b1.HasKey("Id");

                            b1.HasIndex("DashboardTabId");

                            b1.ToTable("InformationCard", "Guben");

                            b1.WithOwner()
                                .HasForeignKey("DashboardTabId");

                            b1.OwnsOne("Domain.DashboardTab.Button", "Button", b2 =>
                                {
                                    b2.Property<Guid>("InformationCardId")
                                        .HasColumnType("uuid");

                                    b2.Property<bool>("OpenInNewTab")
                                        .HasColumnType("boolean");

                                    b2.Property<string>("Title")
                                        .IsRequired()
                                        .HasColumnType("text");

                                    b2.Property<string>("Url")
                                        .IsRequired()
                                        .HasColumnType("text");

                                    b2.HasKey("InformationCardId");

                                    b2.ToTable("InformationCard", "Guben");

                                    b2.WithOwner()
                                        .HasForeignKey("InformationCardId");
                                });

                            b1.Navigation("Button");
                        });

                    b.Navigation("InformationCards");
                });

            modelBuilder.Entity("Domain.Events.Event", b =>
                {
                    b.HasOne("Domain.Locations.Location", "Location")
                        .WithMany("Events")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.OwnsMany("Domain.Urls.Url", "Urls", b1 =>
                        {
                            b1.Property<Guid>("EventId")
                                .HasColumnType("uuid");

                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("integer");

                            NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b1.Property<int>("Id"));

                            b1.Property<string>("Description")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<string>("Link")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.HasKey("EventId", "Id");

                            b1.ToTable("Url", "Guben");

                            b1.WithOwner()
                                .HasForeignKey("EventId");
                        });

                    b.Navigation("Location");

                    b.Navigation("Urls");
                });

            modelBuilder.Entity("Domain.Projects.Project", b =>
                {
                    b.HasOne("Domain.Users.User", null)
                        .WithMany()
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("EventCategory", b =>
                {
                    b.HasOne("Domain.Category.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoriesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Domain.Events.Event", null)
                        .WithMany()
                        .HasForeignKey("EventsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Domain.Locations.Location", b =>
                {
                    b.Navigation("Events");
                });
#pragma warning restore 612, 618
        }
    }
}
