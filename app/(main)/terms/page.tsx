"use client"

import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose dark:prose-invert space-y-6">
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
