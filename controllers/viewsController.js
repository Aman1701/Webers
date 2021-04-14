const fetch = require("node-fetch");
const { disable } = require("../app");
exports.getLaunchpads = async (req, res) => {
  // 1) Get all launchpad data
  const result = await fetch("https://api.spacexdata.com/v4/launchpads");
  const apiLaunchpads = await result.json();

  let launchpads = [];
  apiLaunchpads.forEach((launchpad) => {
    launchpads.push({
      name: launchpad.name,
      status: launchpad.status,
      launches:
        launchpad.launches.length > 0
          ? launchpad.launches.filter((launch, i) => i < 3)
          : "0",
      details:
        launchpad.details.length > 225
          ? `${launchpad.details.substring(0, 225) + "..."} `
          : launchpad.details,
    });
  });

  // console.log(launchpads);
  // 2) Build template-Done with Pug

  //3) Render that template using launchpad data
  res.status(200).render("launchpads", {
    title: "All Launchpads",
    launchpads,
  });
};

exports.getOneLaunch = async (req, res) => {
  try {
    //1) Get the id from the request
    const id = req.params.id;

    //2) Get the launch data from the API
    const apiLaunch = await fetch(
      `https://api.spacexdata.com/v4/launches/${id}`
    );
    const launchData = await apiLaunch.json();
    console.log(launchData);

    let launchImageData = [];

    if (launchData.links.flickr.original.length === 0) {
      launchImageData.push(launchData.links.patch.large);
    } else {
      launchImageData = [...launchData.links.flickr.original];
    }
    //3) Build template with that launch data

    //4) Render that template using launch data
    res.status(200).render("launch", {
      title: "A Launch",
      launchData,
      launchImageData,
    });
  } catch (err) {
    res.status(404).render("nolaunch");
  }
};
