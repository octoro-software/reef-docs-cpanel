import { Icon } from "../../../../components";
import { LoggedInUserProfileImage } from "../../../LoggedInUserProfileImage/LoggedInUserProfileImage";

export const Data = {
  home: {
    cards: [
      {
        title: "Menu and Guides!",
        subTitle:
          "If you need help while using the app, please press the action wheel and select 'Help' to see guides for the current screen.",
        description:
          "The action wheel provides quick access to features specific to the screen you are currently on.",
        image: "app/ftu/ftu-wheel-menu.gif",
        freshImage: "app/ftu/fresh-menu.gif",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Account and Settings",
        subTitle:
          "You can access your account and settings by pressing your profile picture in the top right corner.",
        description: "",
        customCard: () => {
          return <LoggedInUserProfileImage width={128} height={128} />;
        },
      },
    ],
  },
  livestockDatabase: {
    cards: [
      {
        title: "Menu",
        subTitle:
          "The menu wheel allows you to request new livestock profiles, as well as switch between the different livestock database types.",
        description: "",
        image: "app/ftu/database-menu.gif",
        freshImage: "app/ftu/plant-menu.gif",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Menu",
        subTitle: "From the left, search, sort by and filter the database.",
        description: "",
        image: "app/ftu/database-listing-actions.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
    ],
  },
  tankIndex: {
    cards: [
      {
        title: "Tank",
        subTitle:
          "You can create as many tanks as you need. To create a new tank, use the action wheel. To edit an existing tank, tap and hold the tank card. To view the tank, simply tap the tank card.",
        description:
          "When creating a tank, you can choose the type of tank which will grant you access to different features. For example, creating an RO Reservoir tank will allow you to add RO ICP Tests.",
        freshDescription: "",
        image: "app/ftu/reef-tank.png",
        freshImage: "app/ftu/fresh-tank.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
    ],
  },
  tankTasks: {
    cards: [
      {
        title: "Tasks",
        subTitle:
          "You can create tasks for your tanks. These can be used as useful reminders and propmts for you to help maintain your tank.",
        description:
          "Using the action wheel, create a new task. Choose a starting date and if it repeats, how often it repeats. This is represented in every X days.",
        image: "app/ftu/create-task.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Tasks",
        subTitle:
          "To complete a task, simply tap the task. To undo, tap the task again.",
        description: "To edit the task, tap and hold the task card.",
        image: "app/ftu/task-carbon.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Task Settings",
        subTitle:
          "Open task settings from the Menu. You can choose push notifications and email notifications for tasks. You can also specify upto 3 specific times during the day to be notified of outstanding tasks.",
        description:
          "Task settings apply to all tanks and are not scoped on a tank by tank basis.",
        image: "app/ftu/task-settings.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
    ],
  },
  livestockProfile: {
    cards: [
      {
        title: "Information",
        subTitle:
          "You can tap any of the information cards to view more information. This also includes community vote results where applicable.",
        description: "",
        image: "app/ftu/livestock-cards.gif",
        freshImage: "app/ftu/fresh-info-cards.gif",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Contributing - Votes",
        subTitle:
          "To contribute to the community, you can vote on the information we have. Tap the icon to enable voting. Then select any card in blue to cast your vote.",
        image: "app/ftu/livestock-vote-cards.gif",
        freshImage: "app/ftu/fresh-contribute.gif",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Contributing - Media",
        subTitle:
          "Tap the camera icon to view other users image contributions. You can also contribute your own images.",
        description:
          "All media is screened and requires verification. You will receive a notification if your contribution was accepted or rejected.",
        customCard: () => {
          return <Icon name="reefDocsCamera" width={128} height={128} />;
        },
      },
      {
        title: "Contributing - Experiences",
        subTitle:
          "Tap the comment icon to view other users experiences with the livestock. You can also contribute your own experiences.",
        description:
          "All experiences are screened and requires verification. You will receive a notification if your experience contribution was accepted or rejected.",
        customCard: () => {
          return <Icon name="reefDocsComment" width={128} height={128} />;
        },
      },
    ],
  },
  testing: {
    cards: [
      {
        title: "Testing - Current Standing",
        subTitle:
          "Current standing shows each of your previously tested parameters with their last known test result.",
        description: `You can use the filter to only show parameters based on their test type. For example, if you only want to see results that are home testable, you can filter by that.\n \nIn the above example, Alkalinity was tested on the 15th May 2025 during a home test. An ICP Test was performed on the 22nd which included Alkalinity, that result became the current standing as its the last known result.`,
        freshDescription: "",
        image: "app/ftu/params.png",
        freshImage: "app/ftu/fresh-current-standing.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Testing - Historic View",
        subTitle:
          "Historic view shows a timeline of tests by month. To edit a test tap the Home Test or ICP test header for the respective test.",
        freshSubTitle:
          "Historic view shows a timeline of tests by month. To edit a test tap the test header for the respective test.",
        image: "app/ftu/historic-view.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Testing - Settings",
        subTitle:
          "Tap any parameter card to view more detailed information about that specific parameter.",
        description: "",
        image: "app/ftu/param-card.png",
        imageProps: {
          resizeMode: "contain",
          width: 200,
        },
      },
      {
        title: "Testing - Settings",
        subTitle: "Using the menu, tap the test settings.",
        description:
          "This will display all parameters available and their current setup.",
        customCard: () => {
          return <Icon name="reefDocsTestSettings" width={128} height={128} />;
        },
      },
      {
        title: "Testing - Settings",
        subTitle:
          "Once in test settings you will be presented with the following screen.",
        description:
          "Configure Home Test Parameters and ICP Test Parameters. Tap any of the elements to configure them",
        freshDescription:
          "Configure any of your parameters by tapping on them.",
        image: "app/ftu/test-settings-1.png",
        freshImage: "app/ftu/fresh-test-settings.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
      {
        title: "Testing - Settings",
        subTitle:
          "You can enable or disable this element. This will remove it from the test entry form.",
        description:
          "Select the applicable test unit as well as your preferred low range, target and high range.",
        image: "app/ftu/test-settings-2.png",
        freshImage: "app/ftu/fresh-test-settings-2.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
    ],
  },
  elementTesting: {
    cards: [
      {
        title: "Testing - Chart",
        subTitle:
          "Traverse through the chart to see key information about your parameters.",
        description: `Use the month filters to change the data set based on months.`,
        image: "app/ftu/chart-view.gif",
        imageProps: {
          height: 400,
          resizeMode: "contain",
        },
      },
      {
        title: "Testing - Chart",
        subTitle:
          "When you see this icon on the chart, it means comments where left when you complete the test. Tap it to view the comments you left.",
        customCard: () => {
          return <Icon name="reefDocsComment" width={128} height={128} />;
        },
      },
      {
        title: "Testing - Dosing Chart",
        subTitle: "Tap the dosing tab to change the chart data to dosing data.",
        description: "",
        image: "app/ftu/dosing-chart.png",
        imageProps: {
          resizeMode: "contain",
          height: 400,
        },
      },
      {
        title: "Testing - Dosing",
        subTitle:
          "When in the testing view, you will see a droplet with a ml value. This is the total amount of dosing recorded from the previous test result to the current test result.",
        description: `Tap the droplet to view the dosing history for that period.`,
        image: "app/ftu/chart-view.gif",
        imageProps: {
          height: 400,
          resizeMode: "contain",
        },
      },
      {
        title: "Testing - Dosing",
        subTitle:
          "To edit a dosage record, tap the dosage which will display the full dosage test including all other parameters that where dosed on that test.",
        description: "",
        image: "app/ftu/dosing-history.png",
        imageProps: {
          resizeMode: "contain",
        },
      },
    ],
  },
};
