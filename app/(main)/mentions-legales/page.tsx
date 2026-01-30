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

          <h1>Conditions Générales de Vente</h1>

          <h2>1. Champ d’application</h2>
          <p>
            Les présentes Conditions Générales de Vente (ci-après « CGV ») s’appliquent à l’ensemble des prestations de services fournies par CERAMIKA, quel que soit le type de client (professionnels, collectivités, administrations, associations).
            Toute commande implique l’adhésion pleine et entière du client aux présentes CGV, à l’exclusion de tout autre document.
          </p>

          <h2>2. Identification du prestataire</h2>
          <p>
            CERAMIKA<br />
            Statut juridique : SAS, société par actions simplifiée<br />
            Siège social : 10 RUE SOLFERINO 06220 VALLAURIS<br />
            SIRET : 94222785100030<br />
            Email : <a href="mailto:contact@cerami-ka.com">contact@cerami-ka.com</a>
          </p>

          <h2>3. Prestations proposées</h2>
          <p>
            CERAMIKA propose notamment (liste non exhaustive) :<br />
            Création de pièces uniques et de collection façonnées à la main<br />
            Le détail des prestations est précisé dans les devis ou propositions commerciales.
          </p>

          <h2>4. Devis et commande</h2>
          <p>
            Toute prestation fait l’objet d’un devis préalable, valable 30 jours à compter de sa date d’émission.
            La commande est considérée comme ferme et définitive dès lors que :
          </p>
          <ul>
            <li>le devis est daté, signé, avec la mention « Bon pour accord »</li>
            <li>et éventuellement accompagné du paiement de l’acompte demandé</li>
          </ul>

          <h2>5. Tarifs</h2>
          <p>
            Les prix sont exprimés en euros (€).
            Les tarifs peuvent être indiqués HT ou TTC selon le statut de l’entreprise.
            Les frais annexes (déplacements, matériel, hébergement, licences, etc.) peuvent être facturés en supplément s’ils ne sont pas inclus dans le devis.
            CERAMIKA se réserve le droit de modifier ses tarifs à tout moment, sans effet rétroactif sur les commandes déjà validées.
          </p>

          <h2>6. Modalités de paiement</h2>
          <p>
            Sauf mention contraire sur le panier :
            Paiement par le système sécurisé ou site web
            Paiement à 30 jours maximum à compter de la date de facturation
            Un acompte peut être exigé avant le démarrage des prestations.
          </p>

          <h2>7. Retard de paiement</h2>
          <p>
            En cas de retard de paiement :
            Des pénalités de retard seront appliquées, calculées sur la base du taux légal en vigueur
            Une indemnité forfaitaire de 40 € pour frais de recouvrement sera exigible (article L441-10 du Code de commerce)
            CERAMIKA se réserve le droit de suspendre toute prestation en cours jusqu’au règlement complet des sommes dues.
          </p>

          <h2>8. Délais d’exécution</h2>
          <p>
            Les délais d’exécution sont donnés à titre indicatif.
            Un retard ne peut en aucun cas justifier l’annulation de la commande ni donner lieu à des pénalités, sauf engagement contractuel spécifique.
          </p>

          <h2>9. Obligations du client</h2>
          <p>
            Le client s’engage à :
          </p>
          <ul>
            <li>Fournir toutes les informations nécessaires à la bonne exécution de la prestation</li>
            <li>Garantir l’accès aux sites, équipements ou données nécessaires</li>
            <li>Régler les sommes dues dans les délais convenus</li>
          </ul>

          <h2>10. Responsabilité</h2>
          <p>
            CERAMIKA est tenue à une obligation de moyens, et non de résultat.
            Sa responsabilité ne pourra être engagée en cas :
            d’utilisation non conforme des installations ou solutions fournies
            de défaillance provenant de tiers (fournisseurs, opérateurs, réseaux)
            de force majeure.
          </p>

          <h2>11. Propriété intellectuelle</h2>
          <p>
            Sauf mention contraire, les études, documents techniques, schémas, rapports et livrables restent la propriété de CERAMIKA jusqu’au paiement intégral de la prestation.
            Toute reproduction ou utilisation sans autorisation écrite est interdite.
          </p>

          <h2>12. Confidentialité</h2>
          <p>
            Les parties s’engagent à conserver confidentielles les informations, données et documents échangés dans le cadre de la prestation.
            Cette obligation demeure valable après la fin de la prestation.
          </p>

          <h2>13. Résiliation</h2>
          <p>
            En cas de manquement grave par l’une des parties à ses obligations, le contrat pourra être résilié de plein droit après mise en demeure restée sans effet.
            Les prestations déjà réalisées restent dues.
          </p>

          <h2>14. Données personnelles</h2>
          <p>
            Les données personnelles collectées sont traitées conformément au RGPD.
            Le client dispose d’un droit d’accès, de rectification et de suppression de ses données en contactant : <a href="mailto:contact@cerami-ka.com">contact@cerami-ka.com</a>.
          </p>

          <h2>15. Droit applicable et litiges</h2>
          <p>
            Les présentes CGV sont soumises au droit français.
            En cas de litige, une solution amiable sera recherchée en priorité.
            À défaut, les tribunaux compétents seront ceux du ressort du siège social de CERAMIKA.
          </p>

          <hr />

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
