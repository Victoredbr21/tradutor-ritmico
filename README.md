# 🎸 Ritmo Master — Tradutor Rítmico

> Converte batidas de violão em figuras musicais da partitura, em tempo real.

**[▶ Abrir o App](https://tradutor-ritmico.vercel.app)** · Feito por [Victor](https://github.com/Victoredbr21)

---

## O que é isso?

Quando você toca violão, cada palhetada que você dá (pra baixo ↓ ou pra cima ↑) ocupa uma fração do tempo musical. O **Ritmo Master** pega o padrão de palhetadas que você montou e traduz esse padrão para as **figuras musicais** equivalentes — semínima, colcheia, semicolcheia etc. — que são as notações usadas em partituras.

É uma ponte entre a linguagem prática do violonista e a linguagem formal da teoria musical.

---

## ✨ Funcionalidades

- **Builder visual** — monta cada beat clicando em botões ↓ ↑ ✋, sem digitar nada
- **15 padrões preset** — incluindo Samba, Bossa Nova, Baião, Forró, Valsa, Metal, Funk, Reggae e mais
- **Modo manual** — digita direto no formato `v|v^|-^|v` se preferir
- **BPM em tempo real** — slider de 40 a 220 BPM com atalhos rápidos
- **Teclado de acordes** — notas A–G + modificadores (m, 7, M7, sus2, sus4, #, ♭)
- **Inferência de compasso** — detecta automaticamente 2/4, 3/4, 4/4, 6/8...
- **Duração em milissegundos** — mostra quanto tempo cada figura ocupa em tempo real
- **Tabela de figuras** — referência sempre visível (Semibreve até Fusa)
- **Dark / Light mode** — tema salvo na sessão
- **Mobile-first** — funciona no celular direto pelo navegador

---

## 🚀 Como usar

### Online (recomendado)
Acesse **[tradutor-ritmico.vercel.app](https://tradutor-ritmico.vercel.app)** — sem instalação, sem dependências.

### Local
Clone o repositório e abra o `index.html` no navegador:

```bash
git clone https://github.com/Victoredbr21/tradutor-ritmico.git
cd tradutor-ritmico
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

---

## 🎵 Legenda dos strums

| Símbolo | Tecla | Ação |
|---------|-------|------|
| ↓ | `v` | Palhetada para baixo |
| ↑ | `^` | Palhetada para cima |
| ✋ | `-` | Pausa / mute (sem som) |
| `\|` | `\|` | Divisor de beat (tempo) |

**Exemplo de entrada manual:**
```
v|v^|^v|v
```
Lê-se: beat 1 → ↓ · beat 2 → ↓↑ · beat 3 → ↑↓ · beat 4 → ↓

---

## 🥁 Os 15 Padrões Preset

| # | Nome | Padrão | Compasso |
|---|------|--------|----------|
| 1 | Padrão 1 | `v\|v\|^^\|vv` | 4/4 |
| 2 | Padrão 2 | `v\|v^\|^v\|v` | 4/4 |
| 3 | Padrão 3 | `v\|^v` | 2/4 |
| 4 | Padrão 4 | `v\|v\|v\|v` | 4/4 |
| 5 | Padrão 5 | `v^\|v^\|v^\|v^` | 4/4 |
| 6 | Samba | `v-^\|v^-\|v-^\|v^-` | 4/4 |
| 7 | Bossa Nova | `v\|v^\|-^v\|^` | 4/4 |
| 8 | Baião | `v-v\|^-v\|-v^` | 3/4 |
| 9 | Forró | `v^v\|^v^` | 3/4 |
| 10 | Valsa | `v\|^\|^` | 3/4 |
| 11 | Reggae | `-^\|-^\|-^\|-^` | 4/4 |
| 12 | Funk | `v^v^\|^v^v` | 2/4 |
| 13 | Metal | `vvvv\|vvvv` | 4/4 |
| 14 | Pop | `v\|v^\|^\|v^` | 4/4 |
| 15 | Folk | `v^\|v^\|v^` | 3/4 |

---

## 🎼 Teoria: Como o Ritmo Vira Tempo

Essa é a parte mais importante para entender o que o app faz por baixo dos panos.

### O que é um BPM?

**BPM** (Beats Per Minute) define quantas **semínimas** (♩) cabem em um minuto.

A fórmula base é simples:

```
tempo de 1 beat (ms) = 60.000 ÷ BPM
```

Exemplos:
| BPM | Duração de 1 beat |
|-----|------------------|
| 60 | 1.000 ms (1 segundo exato) |
| 80 | 750 ms |
| 120 | 500 ms |
| 160 | 375 ms |

---

### Como as figuras se relacionam entre si?

As figuras musicais são **divisões binárias do tempo**. Cada figura vale metade da anterior:

```
Semibreve  (𝅝)  = 4 tempos  (4 beats)
    |
    ├─ Mínima (𝅗𝅥) = 2 tempos  (2 beats)
    |       |
    |       ├─ Semínima (♩) = 1 tempo  (1 beat)  ← UNIDADE BASE
    |       |         |
    |       |         ├─ Colcheia (♪) = ½ tempo  (½ beat)
    |       |         |          |
    |       |         |          ├─ Semicolcheia (♬) = ¼ tempo
    |       |         |          |               |
    |       |         |          |               └─ Fusa = ⅛ tempo
```

Isso significa: **2 colcheias = 1 semínima**, **4 colcheias = 1 mínima**, **8 colcheias = 1 semibreve**.

---

### Como as palhetadas viram figuras?

O app divide cada beat (tempo) pelo número de palhetadas dentro dele:

#### Semínima (♩) — 1 palhetada no beat
```
Beat:  [ ↓ ]
Figura: ♩ (1 tempo inteiro)
```
Uma única palhetada ocupa o beat inteiro → **semínima**.

---

#### Colcheias (♪♪) — 2 palhetadas no beat
```
Beat:  [ ↓ ↑ ]
Figura: ♪ ♪ (½ + ½ = 1 tempo)
```
Duas palhetadas dividem o beat ao meio → cada uma é uma **colcheia**.

Isso é o que acontece em praticamente todo padrão de violão popular. O movimento ↓↑ que você repete é exatamente duas colcheias por beat.

---

#### Tercina — 3 palhetadas no beat
```
Beat:  [ ↓ ↑ ↓ ]
Figura: ♪(3) ♪(3) ♪(3)  (⅓ + ⅓ + ⅓ = 1 tempo)
```
Três notas num espaço de duas → **tercina**. Dá aquele balanço característico do shuffle e do swing.

---

#### Semicolcheias (♬♬♬♬) — 4 palhetadas no beat
```
Beat:  [ ↓ ↑ ↓ ↑ ]
Figura: ♬ ♬ ♬ ♬ (¼ + ¼ + ¼ + ¼ = 1 tempo)
```
Quatro palhetadas por beat → **semicolcheias**. Muito comum em estilos como metal e funk rápido.

---

#### Semibreve (𝅝🍩) — 1 palhetada sem divisões
```
Entrada:  [ v ]  (sem barras |
)
Figura: 𝅝 (4 tempos = compasso inteiro)
```
Uma única palhetada que sustenta por 4 tempos → **semibreve** (o famoso 🍩 do código original).

---

### Exemplo real: Bossa Nova a 80 BPM

Padrão: `v|v^|-^v|^`

```
BPM = 80  →  1 beat = 750ms

Beat 1: [ ↓ ]       → 1 palhetada  → ♩  (750ms)
Beat 2: [ ↓ ↑ ]     → 2 palhetadas → ♪♪ (375ms + 375ms)
Beat 3: [ ✋ ↑ ↓ ]  → 3 strums*    → tercina (250ms cada)
Beat 4: [ ↑ ]       → 1 palhetada  → ♩  (750ms)

Total: 4 beats × 750ms = 3.000ms por compasso
```
*pausa conta como subdivisão rítmica

---

### O Compasso

O app infere o compasso automaticamente pelo número de beats:

| Beats detectados | Compasso inferido |
|-----------------|------------------|
| 2 | 2/4 |
| 3 | 3/4 (Valsa) |
| 4 | 4/4 (o mais comum) |
| 6 | 6/8 |
| Outros | exibido como N/4 |

---

## 🗂️ Estrutura do Projeto

```
tradutor-ritmico/
├── index.html        # Entry point (redireciona para o app)
├── ritmo-master.html # HTML principal do app
├── style.css         # Estilos (design system dark/light)
├── app.js            # Lógica do tradutor rítmico
└── README.md         # Este arquivo
```

---

## 📜 Origem

O projeto nasceu como um script Java de linha de comando (`TradutorRitmico.java`) que recebia entradas como `G 1` ou `E v^` no terminal e retornava as figuras musicais correspondentes. A versão web surgiu para tornar a ferramenta acessível em qualquer dispositivo, sem necessidade de JDK instalado.

---

## 🛠️ Tech Stack

- HTML5 + CSS3 + JavaScript puro (sem frameworks, sem dependências)
- Google Fonts (JetBrains Mono + Inter)
- Deploy: [Vercel](https://vercel.com)

---

Made with 🎸 by [Victor](https://github.com/Victoredbr21) — Rio de Janeiro
