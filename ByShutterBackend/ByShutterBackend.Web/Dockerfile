FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Najpierw same projekty -> cache warstwy restore
COPY ByShutterBackend.Domain/*.csproj ByShutterBackend.Domain/
COPY ByShutterBackend.Application/*.csproj ByShutterBackend.Application/
COPY ByShutterBackend.Infrastructure/*.csproj ByShutterBackend.Infrastructure/
COPY ByShutterBackend.Web/*.csproj ByShutterBackend.Web/
RUN dotnet restore ByShutterBackend.Web/ByShutterBackend.Web.csproj

COPY . .
RUN dotnet publish ByShutterBackend.Web/ByShutterBackend.Web.csproj -c Release -o /out --no-restore

# Runtime: sam ASP.NET (bez SDK), uzytkownik bez roota
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Katalogi na wolumeny musza istniec w obrazie z wlascicielem "app",
# wtedy nowy named volume dziedziczy uprawnienia i backend moze zapisywac.
RUN mkdir -p /app/uploads /app/keys && chown -R app:app /app/uploads /app/keys

COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_EnableDiagnostics=0
EXPOSE 8080
USER app

ENTRYPOINT ["dotnet", "ByShutterBackend.Web.dll"]
