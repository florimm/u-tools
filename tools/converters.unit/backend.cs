using Microsoft.AspNetCore.Mvc;

namespace UTools.Tools.Converters.Unit;

public static class Endpoints
{
    public static IEndpointRouteBuilder MapUnitConverter(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/tools/converters/unit");

        group.MapPost("/convert", ([FromBody] ConvertRequest req) =>
        {
            if (req.Value <= 0)
                return Results.BadRequest(new { error = new { code = "InvalidValue", message = "Value must be positive" } });

            double factor = (req.From.ToLower(), req.To.ToLower()) switch
            {
                ("m", "km") => 0.001,
                ("km", "m") => 1000,
                ("ft", "m") => 0.3048,
                ("m", "ft") => 3.28084,
                ("mi", "km") => 1.60934,
                ("km", "mi") => 0.621371,
                ("ft", "mi") => 0.000189394,
                ("mi", "ft") => 5280,
                ("ft", "km") => 0.0003048,
                ("km", "ft") => 3280.84,
                ("m", "mi") => 0.000621371,
                ("mi", "m") => 1609.34,
                var same when same.Item1 == same.Item2 => 1,
                _ => throw new ArgumentException("Unsupported conversion")
            };

            var result = req.Value * factor;
            return Results.Ok(new { result = Math.Round(result, 6) });
        })
        .WithName("ConvertUnits")
        .WithSummary("Convert between different units of measurement");

        return app;
    }

    public record ConvertRequest(double Value, string From, string To);
}