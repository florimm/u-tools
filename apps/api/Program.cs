using UTools.Tools.Converters.Unit;
using UTools.Tools.Network.Ping;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

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
    app.MapOpenApi();
}

app.UseCors();

// Health check
app.MapGet("/", () => "u-tools API");

// Register tool endpoints
app.MapUnitConverter();
app.MapNetworkPing();

app.Run();
