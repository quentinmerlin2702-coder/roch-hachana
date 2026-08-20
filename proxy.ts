import { NextRequest, NextResponse } from "next/server";

/**
 * Protège l'espace "Commandes" (/admin et son API) par un simple identifiant
 * + mot de passe, pour pouvoir le partager avec vos associés sans exposer
 * les coordonnées de vos clients publiquement.
 *
 * Identifiants par défaut (à changer via les variables d'environnement
 * ADMIN_USERNAME / ADMIN_PASSWORD — voir .env.local.example) :
 *   utilisateur : corbeilles
 *   mot de passe : Hababou2655
 */
export function proxy(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USERNAME || "corbeilles";
  const expectedPass = process.env.ADMIN_PASSWORD || "Hababou2655";

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentification requise.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Espace commandes"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
