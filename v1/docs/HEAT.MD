Got it. Here’s a full **Markdown game doc** that pulls together everything we’ve designed: the charity events (minor, mid, major), the NFT Key mechanic, the bribe system, and the heat punishments. It’s structured like a dev-ready spec but still funny for flavor.

---

# 🎩 Pimp.Fun – Heat & Charity System

## 🔥 Heat Overview

* **Heat = Police Attention.**
* Goes up when you commit crimes, expand too fast, or piss off rivals.
* Hard to remove, meant to be a constant pressure system.
* Three ways to reduce it:

  1. **Bribes** (fast, expensive, safe).
  2. **Charity Events** (funny, random, cheaper, risky).
  3. **NFT Keys** (rare, permanent mitigation).

---

## 💵 Police Bribes

* Bribes reduce Heat instantly, but cost a chunk of your Net Worth.
* The more you bribe, the more corruption builds → prices climb + risk of stings.

| Bribe Type           | Cost (% Net Worth) | Heat Reduction | Side Effect                                     |
| -------------------- | -----------------: | -------------: | ----------------------------------------------- |
| Light Bribe          |                 2% |           −15% | Corruption +1                                   |
| Medium Bribe         |                 5% |           −30% | Corruption +2                                   |
| Heavy Bribe          |                10% |           −50% | Corruption +3                                   |
| Overbribe (Capstone) |                15% |           −60% | Corruption +5, 15% Sting: +20 Heat + 1% NW fine |

**Corruption Meter:** each bribe in last 7 days raises bribe costs by +20% and Sting risk by +5%. Meter decays −1/day.

---

## 🎭 Charity Events

Charity is community service for pimps.

* **Turns & Cash Required** depend on tier.
* **Event Flavor** is randomized from that tier’s pool (modal pops with funny description).
* **Backfire Chance:** 5% (Minor), 10% (Mid), 15% (Major).

### 🎲 Tier Math

* **Minor** → 10 turns, 0.5% NW, −8–12 Heat
* **Mid** → 20 turns, 1.5% NW, −15–20 Heat
* **Major** → 35 turns, 3–5% NW, −25–35 Heat

---

### 🟢 Minor Events

(10 turns | 0.5% NW | −8–12 Heat)

1. **Thug Hug Therapy** – *“One hug at a time, the block gets softer.”*
2. **Street Clean-Up Hoe-Down** – *“Mopping corners, then twerking on ’em.”*
3. **Pimps for Potholes** – *“Filling cracks in the road, not just pipes.”*
4. **Free Lemonade Stand** – *“Refreshing the community, one spiked cup at a time.”*
5. **Hoe Yoga in the Park** – *“Stretchin’ legs, clearing karma.”*
6. **Bake Sale Blowout** – *“Brownies so good, even the cops bought some.”*
7. **Thug Dog-Walking Service** – *“Guard dogs need cardio too.”*
8. **Graffiti Mural Painting** – *“Beautify the block with spray-can Picasso.”*
9. **Trash Pick-Up Parade** – *“Pickin’ up cans, droppin’ bass.”*

---

### 🟡 Mid Events

(20 turns | 1.5% NW | −15–20 Heat)

1. **Lap Dances for Literacy** – *“Shakin’ it so kids can read good.”*
2. **Pimp’s Soup Kitchen** – *“Serving broth, blunts, and bread rolls.”*
3. **Adopt-a-Thug Day** – *“Mentoring kids on ‘entrepreneurship.’”*
4. **Pole Dancing for Polio** – *“One spin closer to eradication.”*
5. **Escort the Elderly** – *“Bingo night bodyguards with bling.”*
6. **Thugs Against Drugs 5K** – *“Joggin’ in saggin’ pants for awareness.”*
7. **Charity Car Show** – *“Chrome, candy paint, and donations.”*
8. **Hoe Hospice Volunteering** – *“Comfort crews for the elders.”*
9. **Back-to-School Bookbag Bash** – *“Pencils, notebooks, and peace.”*

---

### 🔴 Major Events

(35 turns | 3–5% NW | −25–35 Heat)

1. **Handjobs for the Homeless** – *“Relief work at its finest.”*
2. **Car Wash for Cops** – *“Buffin’ out the bacon wagons in bikinis.”*
3. **Blood Drive-By** – *“Spraying plasma, not bullets.”*
4. **Pimp Santa Toy Giveaway** – *“Ho, ho, hoes for the holidays.”*
5. **Hoes for Homes (Habitat Build)** – *“Hammerin’ nails, hammerin’ Johns.”*
6. **Cops Invite to the Cookout** – *“Burgers, ribs, and side-eye with the sheriff.”*
7. **Cops & Pimps Charity Basketball** – *“Breaking ankles instead of laws.”*
8. **Strip-a-thon Telethon** – *“Call in your pledges—ratings through the roof.”*
9. **Twerking for Tolerance** – *“Shaking cheeks until the block chills out.”*

---

## 💎 NFT Key to the City

* **Trigger:** 1–3% chance after any Major Charity event.
* **Reward:** *Key to the City* NFT (soulbound to account).
* **Effect:** Permanently reduces all future Heat gain by −10%.
* **Rarity Ladder:**

  * Bronze Key (−5%)
  * Silver Key (−10%)
  * Gold Key (−15%)
  * Diamond Key (−20%)

*“The mayor slips you a golden key and says, ‘Stay low-key, playa.’”*

---

## 🚨 Heat Punishments

Heat is a sliding danger scale.

* **<40% Heat:** cops watching, no punishments.
* **40%+ Heat:** random punishment rolls begin.
* **69%+ Heat:** serious crackdowns.
* **85%+ Heat:** catastrophic losses possible.

| Heat Range             | Punishment Examples                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0–39% (Green)**      | No punishments. Heat just builds faster.                                                                                                                  |
| **40–59% (Yellow)**    | Minor Busts: 1–5 hoes detained, 1 car impounded, 0.5% NW fine.                                                                                            |
| **60–68% (Orange)**    | Raids: lose 25% crack, −10% thugs, or 5–10% cash.                                                                                                         |
| **69–84% (Red)**       | Serious Hits: SWAT bust (−20–30% hoes & thugs), lieutenant jailed, Kia Boys joyride kills thugs & steals cars.                                            |
| **85–100% (Blackout)** | Catastrophic Crackdowns: 50% empire wiped, asset forfeiture (−10% NW), hoes mass arrests (−30%), or Rico Case (instant wipe unless blocked by a Key NFT). |

---

## ⚖️ Strategy Notes

* Bribes = safe, instant, costly.
* Charity = slower, funny, risky, cheaper.
* NFT Keys = rare jackpot, permanent advantage.
* Heat Punishments = escalating disasters that force players to manage risk.

---

Do you want me to also include a **Modal Template Example** in this doc (like how it looks in-game with art, cost, turns, flavor, and RNG outcome), or should we keep this document strictly reference + balance?
