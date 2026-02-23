"use client"

import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose dark:prose-invert space-y-6">
          <h1>Politique de Confidentialité</h1>

          <h2>1. Introduction</h2>
          <p>
            La présente Politique de Confidentialité a pour objectif d’informer les utilisateurs du site https://cerami-ka.com de la manière dont leurs données personnelles sont collectées, utilisées et protégées.
            CERAMIKA s’engage à respecter la réglementation en vigueur applicable au traitement des données personnelles, notamment le Règlement Général sur la Protection des Données (RGPD – UE 2016/679) et la loi « Informatique et Libertés ».
          </p>

          <h2>2. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles est :<br />
            CERAMIKA<br />
            Statut juridique : SAS, société par actions simplifiée<br />
            Siège social : 10 RUE SOLFERINO 06220 VALLAURIS<br />
            Email de contact : <a href="mailto:contact@cerami-ka.com">contact@cerami-ka.com</a>
          </p>

          <h2>3. Données personnelles collectées</h2>
          <p>
            Les données personnelles susceptibles d’être collectées sur le site sont notamment : Nom et prénom, Adresse email, Numéro de téléphone, Nom de l’entreprise / organisation, Message transmis via le formulaire de contact, Données de navigation (cookies, adresse IP, type de navigateur).
            Ces données sont collectées uniquement lorsque l’utilisateur les fournit volontairement (formulaire, email, etc.).
          </p>

          <h2>4. Finalités du traitement</h2>
          <p>
            Les données personnelles sont collectées pour les finalités suivantes : Répondre aux demandes de contact ou d’information, Établir des devis et assurer le suivi commercial, Exécuter les prestations contractuelles, Améliorer le fonctionnement et la sécurité du site, Réaliser des statistiques de fréquentation anonymisées.
          </p>

          <h2>5. Base légale du traitement</h2>
          <p>
            Le traitement des données repose sur : Le consentement de l’utilisateur, L’exécution d’un contrat ou de mesures précontractuelles, Le respect d’obligations légales, L’intérêt légitime de CERAMIKA (gestion et amélioration du service).
          </p>

          <h2>6. Destinataires des données</h2>
          <p>
            Les données personnelles sont destinées exclusivement à CERAMIKA. Elles ne sont ni vendues, ni louées, ni cédées à des tiers, sauf obligation légale ou prestataires techniques strictement nécessaires (hébergement, maintenance du site).
          </p>

          <h2>7. Durée de conservation des données</h2>
          <p>
            Les données sont conservées : Pendant la durée nécessaire au traitement de la demande, Jusqu’à 3 ans après le dernier contact pour les prospects, Jusqu’à 10 ans pour les données comptables (obligation légale).
          </p>

          <h2>8. Sécurité des données</h2>
          <p>
            CERAMIKA met en œuvre toutes les mesures techniques et organisationnelles appropriées afin de garantir la sécurité, la confidentialité et l’intégrité des données personnelles, et empêcher tout accès non autorisé, perte ou divulgation.
          </p>

          <h2>9. Droits des utilisateurs</h2>
          <p>
            Conformément à la réglementation, l’utilisateur dispose des droits suivants : Droit d’accès, Droit de rectification, Droit d’effacement (droit à l’oubli), Droit d’opposition, Droit à la limitation du traitement, Droit à la portabilité des données.
            Toute demande peut être adressée par email à : <a href="mailto:contact@cerami-ka.com">contact@cerami-ka.com</a>.
          </p>

          <h2>10. Cookies</h2>
          <p>
            Le site peut utiliser des cookies afin : d’assurer son bon fonctionnement, d’améliorer l’expérience utilisateur, de mesurer l’audience du site. L’utilisateur peut configurer son navigateur pour refuser les cookies ou être informé de leur dépôt.
          </p>

          <h2>11. Transfert hors Union Européenne</h2>
          <p>
            Aucune donnée personnelle n’est transférée hors de l’Union Européenne. Si un tel transfert devait avoir lieu, CERAMIKA s’engage à mettre en place les garanties appropriées prévues par le RGPD.
          </p>

          <h2>12. Modification de la politique de confidentialité</h2>
          <p>
            CERAMIKA se réserve le droit de modifier la présente Politique de Confidentialité à tout moment afin de garantir sa conformité avec le droit en vigueur.
            La dernière mise à jour date du : 30/01/2026.
          </p>

          <h2>13. Réclamation</h2>
          <p>
            Si l’utilisateur estime que ses droits ne sont pas respectés, il peut adresser une réclamation auprès de l’autorité compétente : CNIL – Commission Nationale de l’Informatique et des Libertés
          </p>

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
