"use client"

import Link from "next/link"

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose dark:prose-invert space-y-6">
          <h1>Mentions Légales</h1>

          <h2>1. Éditeur du site</h2>
          <p>
            Le présent site est édité par :<br />
            Nom de l’entreprise : CERAMIKA<br />
            Statut juridique : Société par Actions Simplifiée<br />
            Capital social : 1000€<br />
            Siège social : 10 RUE SOLFERINO 06220 VALLAURIS<br />
            Numéro SIRET : 94222785100030<br />
            Numéro RCS / RM : 94222785100022<br />
            TVA intracommunautaire : FR66942227851<br />
            Responsable de la publication : Ethan Laloum<br />
            Email : laloum.ethan@yahoo.com
          </p>

          <h2>2. Hébergement du site</h2>
          <p>
            Le site est hébergé par : Vercel, Inc.<br />
            Nom de l’hébergeur : Vercel, Inc.<br />
            Raison sociale : Vercel, Inc.<br />
            Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
            Contact : support@vercel.com
          </p>
          <p>
            Hébergement de la base de données : Neon (https://neon.tech) — contact : support@neon.tech
          </p>
          <p>
            Nom de domaine / Registrar : IONOS — Elgendorfer Str. 57, 56410 Montabaur, Allemagne — voir https://www.ionos.fr pour contact
          </p>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            L’ensemble du contenu présent sur le site (textes, images, graphismes, logos, icônes, sons, logiciels, etc.) est la propriété exclusive de CERAMIKA, sauf mentions contraires.
            Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans l’autorisation écrite préalable de l’éditeur du site.
            Toute exploitation non autorisée du site ou de l’un quelconque des éléments qu’il contient pourra être considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>

          <h2>4. Responsabilité</h2>
          <p>
            L’éditeur du site s’efforce de fournir sur le site des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires.
            L’utilisateur reconnaît utiliser les informations du site sous sa responsabilité exclusive.
          </p>

          <h2>5. Données personnelles</h2>
          <p>
            Les informations personnelles éventuellement collectées via le site (formulaire de contact, email, etc.) sont destinées exclusivement à CERAMIKA et ne sont en aucun cas cédées à des tiers.
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et Libertés », l’utilisateur dispose d’un droit d’accès, de rectification, d’effacement et d’opposition concernant ses données personnelles.
            Toute demande peut être adressée par email à : <a href="mailto:contact@cerami-ka.com">contact@cerami-ka.com</a>.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Le site peut être amené à utiliser des cookies afin d’améliorer l’expérience utilisateur, réaliser des statistiques de visites ou proposer des contenus adaptés.
            L’utilisateur peut configurer son navigateur pour refuser les cookies ou être informé de leur utilisation.
          </p>

          <h2>7. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français.
            En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
          </p>

          <hr />
          <div className="mt-8">
            <Link href="/" className="text-sm text-stone-600 dark:text-stone-300 hover:underline">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
