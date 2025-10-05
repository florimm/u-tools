using UTools.Tools.Converters.Unit;
using UTools.Tools.Network.Ping;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() 
    { 
        Title = "u-tools API", 
        Version = "v1",
        Description = "Universal Tools API - A collection of useful utilities and tools accessible via REST API",
        Contact = new() { Name = "u-tools", Url = new("https://github.com/florimm/u-tools") }
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "u-tools API v1");
        c.DocumentTitle = "u-tools API Documentation";
    });
}

app.UseCors();

// Health check
app.MapGet("/", () => "u-tools API")
    .WithName("GetApiInfo")
    .WithSummary("Get API information and health status")
    .WithDescription("Returns basic API information to confirm the service is running")
    .WithOpenApi(operation => new(operation)
    {
        Tags = new List<Microsoft.OpenApi.Models.OpenApiTag> { new() { Name = "Health" } },
        Responses = new()
        {
            ["200"] = new() { Description = "API is running and healthy" }
        }
    });

// Register tool endpoints
app.MapUnitConverter();
app.MapNetworkPing();

app.Run();
