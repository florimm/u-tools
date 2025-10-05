using Microsoft.AspNetCore.Mvc;
using System.Net.NetworkInformation;

namespace UTools.Tools.Network.Ping;

public static class Endpoints
{
    public static IEndpointRouteBuilder MapNetworkPing(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/tools/network/ping");

        group.MapPost("/run", async ([FromBody] PingRequest req) =>
        {
            if (string.IsNullOrWhiteSpace(req.Host))
                return Results.BadRequest(new { error = new { code = "InvalidHost", message = "Host cannot be empty" } });

            try
            {
                using var ping = new System.Net.NetworkInformation.Ping();
                var reply = await ping.SendPingAsync(req.Host.Trim(), 5000); // 5 second timeout

                if (reply.Status == IPStatus.Success)
                {
                    return Results.Ok(new
                    {
                        rttMs = reply.RoundtripTime,
                        success = true,
                        host = req.Host.Trim()
                    });
                }
                else
                {
                    return Results.Ok(new
                    {
                        rttMs = 0,
                        success = false,
                        host = req.Host.Trim(),
                        error = reply.Status.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new
                {
                    error = new
                    {
                        code = "PingFailed",
                        message = ex.Message
                    }
                });
            }
        })
        .WithName("PingHost")
        .WithSummary("Ping a network host to test connectivity and measure latency")
        .WithDescription("Sends an ICMP ping to the specified host and returns the round-trip time and success status. Useful for testing network connectivity and measuring latency.")
        .WithOpenApi(operation => new(operation)
        {
            Tags = new List<Microsoft.OpenApi.Models.OpenApiTag> { new() { Name = "Network Tools" } },
            RequestBody = new()
            {
                Description = "Ping request containing the target host (hostname, domain, or IP address)",
                Required = true
            },
            Responses = new()
            {
                ["200"] = new() { Description = "Ping completed (check 'success' field for actual result)" },
                ["400"] = new() { Description = "Invalid input (empty host or ping failure)" }
            }
        });

        return app;
    }

    public record PingRequest(string Host, int Count = 1);
}