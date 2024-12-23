// See https://aka.ms/new-console-template for more information

using Api;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((_, configuration) =>
{
    configuration
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} - {Message:lj}{NewLine}{Exception}");
});

var startup = new Startup(builder.Configuration.AddUserSecrets("76f9201a-484c-461f-b95d-6f81bb7c28f3").Build());
startup.ConfigureServices(builder.Services);

var app = builder.Build();

startup.Configure(app, builder.Environment);