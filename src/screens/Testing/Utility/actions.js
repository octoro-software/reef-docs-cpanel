export const resultActions = {
  "678150bf2366748b5678e247": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Reduce Aeration",
          content:
            "If you’re aggressively aerating or using a skimmer, it can sometimes drive pH too high",
        },
        {
          title: "Control Lighting",
          content:
            "Excessive photosynthesis (from macroalgae or refugium lighting) can drive pH high during light cycles. Reducing the photoperiod may help.",
        },
      ],
      low: [
        {
          title: "Increase Aeration / CO₂ Removal",
          content:
            "Use powerheads for surface agitation or adjust your skimmer",
        },
        {
          title: "Use Soda Ash (Sodium Carbonate)",
          content: "Will raise pH and Alkalinity, use a dosing calculator",
        },
        {
          title: "Kalkwasser Drip",
          content:
            "Slowly dripping kalkwasser (calcium hydroxide) raises both calcium and pH and should be done carefully.",
        },
        {
          title: "Open a Window",
          content:
            "Introducing fresh air into the room can reduce CO₂ buildup, especially in sealed homes.",
        },
        {
          title: "Dose Buffers",
          content: "Dosing pH buffers will increase your pH.",
        },
      ],
    },
  }),
  "678150bf2366748b5678e268": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Water Change",
          content:
            "Performing a water change will dilute the nitrates but is just a temporary fix.",
        },
        {
          title: "Protein Skimmer",
          content:
            "An efficient skimmer removes organic waste before it breaks down into nitrate.",
        },
        {
          title: "Refugium with Macroalgae",
          content:
            "Growing chaetomorpha or other macroalgae in a refugium consumes nitrate and phosphate",
        },
        {
          title: "Deep Sand Bed (DSB)",
          content:
            "A well-established DSB can promote anaerobic bacteria that convert nitrate into nitrogen gas",
        },
        {
          title: "Carbon Dosing",
          content:
            "Dosing vodka, vinegar, or commercial carbon sources.This Feeds beneficial bacteria that consume nitrate and phosphate, which the skimmer can then remove. This must be done with caution to not create a bacteria bloom or oxygen depletion.",
        },
        {
          title: "Better Feeding Practices",
          content:
            "Feed less and more carefully — overfeeding is a common cause of high nitrates.",
        },
        {
          title: "Filter / Sump Maintenance",
          content:
            "Clean mechanical filters (sponges, socks, floss) frequently.",
        },
        {
          title: "Live Rock & Biological Filtration",
          content:
            "Ensure you have sufficient live rock for natural denitrification, Check that flow prevents dead spots where detritus can accumulate.",
        },
      ],
      low: [
        {
          title: "Dose Nitrate Directly",
          content:
            "Dose a product directly to your tank following manufacturers guidelines.",
        },
        {
          title: "Reduce Nutirent Export",
          content: "Turn your skimmer off for periods of time.",
        },
        {
          title: "Increase Feeding",
          content: "Increase feeding temporarily.",
        },
      ],
    },
  }),
  "681a6cc8616b9a564e0a2bd3": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [],
      low: [],
    },
  }),
  "678150bf2366748b5678e26c": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "GFO (Granular Ferric Oxide) Media",
          content:
            "Very Effective at remove Phosphates. Use in a Reactor for best results or in a media bag in a high flow area. Replace when exhausted to prevent leaching.",
        },
        {
          title: "Refugium with Macroalgae (Chaetomorpha)",
          content:
            "Grows by consuming nitrate and phosphate and is a long term natural solution.",
        },
        {
          title: "Lanthanum Chloride",
          content:
            "Dosing Lanthanum Chloride. Use with caution: must be dosed carefully and typically run through a mechanical filter to catch precipitates",
        },
        {
          title: "Water Changes",
          content:
            "Performing a water change will dilute the phosphates but is just a temporary fix.",
        },
        {
          title: "Reduce Overfeeding",
          content:
            "Overfeeding fish and or corals is the main source of increased phosphate levels. Reduce this.",
        },
        {
          title: "Protein Skimmer",
          content:
            "Removes organic matter before it can break down into phosphate. This will help but shouldnt be considered as the primary export method.",
        },
        {
          title: "Rinse Frozen Food",
          content:
            "Rinsing frozen food in RODI water will help keep phosphates down.",
        },
      ],
      low: [
        {
          title: "Dose Phosphate Directly",
          content:
            "Dose a product directly to your tank following manufacturers guidelines.",
        },
        {
          title: "Increase Feeding",
          content: "Increase your feeding temporarily.",
        },
        {
          title: "Reduce Export Methods",
          content: "Dial back your export methods temporarily.",
        },
      ],
    },
  }),
  "67911243ac607b3f716e02ff": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> if you are not currently cycling your tank we recommend immediate action.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br />`,
      normal: `<p>Your latest result is showing your your ammonia levels are great</p><br /> Keep it up!.`,
    },
    note: "When you test for Ammonia, most hobby-grade test kits give you Total Ammonia (NH₃ + NH₄⁺). We should be concerned with NH₃ as that is the toxic level.",
    suggestions: {
      high: [
        {
          title: "Stop Feeding",
          content:
            "Reduce or pause feeding until you have the ammonia under control. Feeding will just increase the problem.",
        },
        {
          title: "Water Change",
          content:
            "Perform a large water change 20% - 50% possibly higher depending on your reading.",
        },
        {
          title: "Add a Detoxifier",
          content:
            "Dosing a detoxifier will convert the toxic form NH₃ of ammonia to the none toxic form NH₄⁺, remember this will not alter your test readings.",
        },
        {
          title: "Aeration",
          content: "Increase aeration. Ammonia reduces oxygen availability.",
        },
        {
          title: "Check for Dead or Decaying matter",
          content:
            "In an established system normally ammonia spikes come from an organism decaying in the tank. Find it and remove it if possible.",
        },
        {
          title: "Beneficial Bacteria",
          content:
            "Ensure your biological filter is intact and not recently washed in tap water or replaced entirely.",
        },
      ],
      low: [],
    },
  }),
  "678150bf2366748b5678e246": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Stop Dosing",
          content: "Stop all dosing and allow your organisms to consume it.",
        },
        {
          title: "Increase pH",
          content:
            "If your tank’s pH is low, increasing it can help speed alkalinity consumption (since corals calcify more efficiently at higher pH).",
        },
      ],
      low: [
        {
          title: "Dosing",
          content:
            "Dose a product directly to your tank following manufacturers guidelines. Bicarbonate raises alkalinity with little impact on pH",
        },
        {
          title: "Kalkwasser (Calcium Hydroxide)",
          content:
            "Raises both alkalinity and calcium while also boosting pH. Must be used with care to avoid a pH spike.",
        },
      ],
    },
  }),
  "678150bf2366748b5678e24b": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Add RODI Water",
          content:
            "Gradually replace saltwater with RODI water. Test Frequently using a calibrated device.",
        },
        {
          title: "Water Change Slightly Lower Salinity Water",
          content:
            "If you perform water changes, you can reduce the salinity of the fresh water slightly.",
        },
      ],
      low: [
        {
          title: "Add Salt",
          content:
            "Slowly raise your salt levels. Stability is key and a sudden change in salinity can cause more harm than leaving it where its at. Gradually increase.",
        },
      ],
    },
  }),
  "6791129bac607b3f716e0300": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b>.</p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Chiller",
          content:
            "Add a chiller system to your tank to help keep your tank cool.",
        },
        {
          title: "Fans",
          content:
            "Clip on fans across the water surface can be effective at reducing the temperature of the tank.",
        },
        {
          title: "Raise Tank Lights",
          content:
            "Tank lights create heat, raising them up or reducing the intensity will reduce heat transfer.",
        },
      ],
      low: [
        {
          title: "Check Heater",
          content:
            "Your heater is either defective or is not rated for your tank volume. Add a secondary if needed.",
        },
        {
          title: "Heat the Room",
          content:
            "Heating the room can help with increasing the tanks temperature.",
        },
        {
          title: "Insulation",
          content:
            "Providing insulation around the tank will help the tank retain some heat.",
        },
      ],
    },
  }),
  "678150bf2366748b5678e269": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> if you are not currently cycling your tank we recommend immediate action.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br />`,
      normal: `<p>Your latest result is showing your your nitrite levels are great</p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Stop Feeding",
          content:
            "Reduce or pause feeding until you have the ammonia under control. Feeding will just increase the problem.",
        },
        {
          title: "Water Change",
          content:
            "Perform a large water change 20% - 50% possibly higher depending on your reading.",
        },
        {
          title: "Aeration",
          content:
            "Increase aeration. High nitrite can impair oxygen transport in fish.",
        },
        {
          title: "Check for Dead or Decaying matter",
          content:
            "In an established system normally ammonia spikes come from an organism decaying in the tank. Find it and remove it if possible.",
        },
        {
          title: "Beneficial Bacteria",
          content:
            "Ensure your biological filter is intact and not recently washed in tap water or replaced entirely.",
        },
      ],
      low: [],
    },
  }),
  "678150bf2366748b5678e252": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b>.</p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Stop Dosing",
          content:
            "Stop all dosing immediately and allow your organisms to consume it.",
        },
        {
          title: "Water Change",
          content:
            "Water changes will help slowly bring the levels down. Avoid causing large swings.",
        },
      ],
      low: [
        {
          title: "Dosing",
          content:
            "Reef Specific additives are best, MAG Flake or Epsom Salt are good options. Dose slowly no more than 50ppm to 100ppm per day.",
        },
        {
          title: "Calcium and Alkalinity",
          content:
            "We suggest monitoring and testing Calcium and Alkalinity as they are all interconnected.",
        },
      ],
    },
  }),
  "678150bf2366748b5678e255": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b>.</p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Stop Dosing",
          content:
            "Stop all dosing immediately and allow your organisms to consume it.",
        },
        {
          title: "Water Change",
          content:
            "Water changes will help slowly bring the levels down. Avoid causing large swings.",
        },
      ],
      low: [
        {
          title: "Dosing",
          content:
            "Using reef grade supplements to increase your strontium levels. This should be done carefully and following the manufacturers guidelines.",
        },
      ],
    },
  }),
  "678150bf2366748b5678e24f": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b>.</p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Stop Dosing",
          content:
            "Stop all dosing immediately and allow your organisms to consume it.",
        },
        {
          title: "Water Change",
          content:
            "Water changes will help slowly bring the levels down. Avoid causing large swings.",
        },
      ],
      low: [
        {
          title: "Dosing",
          content:
            "Using reef grade supplements to increase your calcium levels. This should be done carefully and following the manufacturers guidelines.",
        },
        {
          title: "Calcium Reactor",
          content:
            "Dissolve media using CO₂ to provide calcium, alkalinity, and trace elements.",
        },
        {
          title: "Kalkwasser",
          content: "Adds calcium + alkalinity.",
        },
      ],
    },
  }),
  "678150bf2366748b5678e25d": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b>.</p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Stop Dosing",
          content:
            "Stop all dosing immediately and allow your organisms to consume it.",
        },
        {
          title: "Water Change",
          content:
            "Water changes will help slowly bring the levels down. Avoid causing large swings.",
        },
        {
          title: "Activated Carbon",
          content:
            "High-quality GAC (granular activated carbon) helps absorb excess iodine and other organics. Replace every few days if levels are very high",
        },
      ],
      low: [
        {
          title: "Dosing",
          content:
            "Using reef grade supplements to increase your iodine levels. This should be done carefully and following the manufacturers guidelines.",
        },
      ],
    },
  }),
  "678150bf2366748b5678e25c": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b>.</p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "Stop Dosing",
          content:
            "Stop all dosing immediately and allow your organisms to consume it.",
        },
        {
          title: "Water Change",
          content:
            "Water changes will help slowly bring the levels down. Avoid causing large swings.",
        },
        {
          title: "Activated Carbon",
          content:
            "High-quality GAC (granular activated carbon) helps absorb copper and other organics. Replace every few days if levels are very high",
        },
      ],
      low: [
        {
          title: "Dosing",
          content:
            "Using reef grade supplements to increase your calcium levels. This should be done carefully and following the manufacturers guidelines.",
        },
      ],
    },
  }),
  "67c63162ff689eb6c7712ae6": (chosenElement) => ({
    text: {
      high: `<p>Your latest result is showing your above your range high of <b>${chosenElement?.element?.rangeHigh}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      low: `<p>Your latest result is showing your below your range low of <b>${chosenElement?.element?.rangeLow}</b> for <b>${chosenElement?.element?.symbol}</b></p><br /> We have some suggestions for you to bring your levels back to range.`,
      normal: `<p>Your latest result is showing your within your range of <b>${chosenElement?.element?.rangeLow}</b> to <b>${chosenElement?.element?.rangeHigh}</b>.</p><br /> Keep it up!.`,
    },
    suggestions: {
      high: [
        {
          title: "RODI Water",
          content:
            "Confirm your DI resin is still effective. TDS level should be 0",
        },
        {
          title: "GFO",
          content:
            "GFO media can bind and remove silicates as well as phosphates.",
        },
        {
          title: "Water Change",
          content: "Water changes will help slowly bring the levels down.",
        },
      ],
      low: [],
    },
  }),
};
