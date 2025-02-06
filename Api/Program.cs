// See https://aka.ms/new-console-template for more information

using Api;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((_, configuration) =>
{
  configuration
    .WriteTo.Console(
      outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} - {Message:lj}{NewLine}{Exception}");
});

var startup = new Startup(builder.Configuration.AddUserSecrets("862e5031-ca08-41e1-ab0b-9c9ccb900ad0").Build());
startup.ConfigureServices(builder.Services);

var app = builder.Build();

startup.Configure(app, builder.Environment);
