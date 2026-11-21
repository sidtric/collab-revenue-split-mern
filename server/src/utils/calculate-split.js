export function calculateSplit({
  price,
  platformFeePercent,
  creatorASplit,
  creatorAName,
  creatorBName,
}) {
  const gross = Number(price) || 0;
  const fee = Math.round((gross * Number(platformFeePercent || 0)) / 100);
  const net = gross - fee;
  const creatorAAmount = Math.round((net * Number(creatorASplit || 0)) / 100);
  const creatorBAmount = net - creatorAAmount;
  const creatorBSplit = 100 - Number(creatorASplit || 0);

  return {
    gross,
    fee,
    net,
    creatorAAmount,
    creatorBAmount,
    creatorASplit: Number(creatorASplit || 0),
    creatorBSplit,
    ledger: [
      {
        owner: "platform",
        type: "fee",
        amount: fee,
        note: "Platform fee reserved before settlement",
      },
      {
        owner: creatorAName,
        type: "credit",
        amount: creatorAAmount,
        note: `${creatorASplit}% of net revenue`,
      },
      {
        owner: creatorBName,
        type: "credit",
        amount: creatorBAmount,
        note: `${creatorBSplit}% of net revenue`,
      },
    ],
  };
}

export function calculateRefundPreview({
  settled,
  creatorAName,
  creatorBName,
  creatorAAmount,
  creatorBAmount,
}) {
  if (!settled) {
    return [
      `${creatorAName} ledger decreases by ${creatorAAmount}.`,
      `${creatorBName} ledger decreases by ${creatorBAmount}.`,
      "No clawback issue because settlement has not happened yet.",
    ];
  }

  return [
    `${creatorAName} gets a negative balance adjustment in the next settlement cycle.`,
    `${creatorBName} also gets a negative balance adjustment in the next settlement cycle.`,
    "Post-settlement refunds are harder, so the MVP should prefer refund-before-settlement handling.",
  ];
}
