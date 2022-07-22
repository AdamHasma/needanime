<script>
  import { onMount } from "svelte";
  import { Accordion, AccordionItem } from "svelte-simple-accordion";
  import ContentLoader from "svelte-content-loader";

  // search clicked var
  let noResults = false;

  // current page integer var
  let currentPage = 1;

  // -5, -10, +5, +10,  array of numbers
  const fromDateNums = [-5, -10, 5, 10];

  // simple array of numbers from 1 to 10
  const scoreRating = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // selcted rating
  let selectedRating = 0;

  // set rating to selected rating
  const setRating = (rating) => {
    // if rating is the same as selected rating reset to 0
    if (rating === selectedRating) {
      selectedRating = 0;
    } else {
      // else set to selected rating
      selectedRating = rating;
    }
  };

  const genres = [
    [{ Action: 1 }, { Martial_Arts: 17 }],
    [{ Adventure: 2 }, { Historical: 13 }, { Space: 29 }],
    [
      { Comedy: 4 },
      { Drama: 8 },
      { Music: 19 },
      { School: 23 },
      { Sports: 30 },
      { Slice_of_Life: 36 },
    ],
    [
      { Fantasy: 10 },
      { Game: 11 },
      { Magic: 16 },
      { Mecha: 18 },
      { Sci_Fi: 24 },
      { Super_Power: 31 },
    ],
    [
      { Horror: 14 },
      { Mystery: 7 },
      { Psychological: 40 },
      { Supernatural: 37 },
      { Thriller: 41 },
    ],
    [{ Shounen: 27 }, { Shoujo: 25 }, { Kids: 15 }, { Seinen: 42 }],
    [{ Romance: 22 }, { Harem: 35 }],
  ];

  // selected genres
  let selectedGenres = [];

  // each genre button
  let genreButton;

  // get every value from genres array
  const getGenres = () => {
    selectedGenres = [];
    genres.forEach((genre) => {
      genre.forEach((genre) => {
        for (let key in genre) {
          selectedGenres.push(genre[key]);
        }
      });
    });
  };

  // clicked state of genre button
  let clickedIncludeBtn = false;

  // toggle include button
  const toggleIncludeBtn = () => {
    if (clickedIncludeBtn) {
      selectedGenres = [];
      selectedExcludeGenres = [];
    } else {
      selectedExcludeGenres = [];
      getGenres();
    }
    clickedIncludeBtn = !clickedIncludeBtn;
  };

  // add to selected genres with spread operator if it doesn't already exist
  const addGenre = (genre) => {
    if (!selectedGenres.includes(genre)) {
      selectedGenres = [...selectedGenres, genre];
    } else {
      selectedGenres = selectedGenres.filter((item) => item !== genre);
    }
    // if genre exists in selectedExcludeGenres
    // find the index of the genre in the array and delete it
    if (selectedExcludeGenres.includes(genre)) {
      selectedExcludeGenres = selectedExcludeGenres.filter(
        (item) => item !== genre
      );
    }
  };

  // selected exclude genres
  let selectedExcludeGenres = [];

  // get every value from genres array to selected exclude genres
  const getExcludeGenres = () => {
    selectedExcludeGenres = [];
    genres.forEach((genre) => {
      genre.forEach((genre) => {
        for (let key in genre) {
          selectedExcludeGenres.push(genre[key]);
        }
      });
    });
  };

  // clicked state of exclude button
  let clickedExcludeBtn = false;

  // toggle exclude button
  const toggleExcludeBtn = () => {
    if (clickedExcludeBtn) {
      selectedExcludeGenres = [];
      selectedGenres = [];
    } else {
      selectedGenres = [];
      getExcludeGenres();
    }
    clickedExcludeBtn = !clickedExcludeBtn;
  };

  // add to selected exclude genres with spread operator if it doesn't already exist
  const addExcludeGenre = (genre) => {
    if (!selectedExcludeGenres.includes(genre)) {
      selectedExcludeGenres = [...selectedExcludeGenres, genre];
    } else {
      selectedExcludeGenres = selectedExcludeGenres.filter(
        (item) => item !== genre
      );
    }
    // if genre exists in selectedGenres
    // find the index of the genre in the array and delete it
    if (selectedGenres.includes(genre)) {
      selectedGenres = selectedGenres.filter((item) => item !== genre);
    }
  };

  // anime type
  const animeType = ["TV", "Movie", "OVA", "ONA"];

  // selected anime type
  let selectedAnimeType = ["tv", "movie", "ova", "ona"];

  // set anime type to selected anime type if it doesn't already exist, if it does, remove it
  const setAnimeType = (type) => {
    if (!selectedAnimeType.includes(type)) {
      selectedAnimeType = [...selectedAnimeType, type];
    } else {
      selectedAnimeType = selectedAnimeType.filter((item) => item !== type);
    }
  };

  // from date
  let fromDate = "1980-01-01";

  // to date (today)
  let toDate = new Date().toISOString().split("T")[0];

  // like increaseToDate function but with switch case with either fromDate or toDate
  const increaseDate = (fromOrTo, year) => {
    switch (fromOrTo) {
      case "from":
        fromDate = new Date(fromDate);
        fromDate.setFullYear(fromDate.getFullYear() + year);
        fromDate = fromDate.toISOString().split("T")[0];
        break;
      case "to":
        toDate = new Date(toDate);
        toDate.setFullYear(toDate.getFullYear() + year);
        toDate = toDate.toISOString().split("T")[0];
        break;
      default:
        break;
    }
  };

  // set year (first word of variable) with number input to either fromDate or toDate with switch case
  const setDateYear = (fromOrTo, year) => {
    switch (fromOrTo) {
      case "from":
        // set first number of fromDate to year with splice
        fromDate = fromDate.split("-");
        fromDate[0] = year;
        fromDate = fromDate.join("-");
        console.log(fromDate);
        break;
      case "to":
        // set first number of toDate to year with splice
        toDate = toDate.split("-");
        toDate[0] = year;
        toDate = toDate.join("-");
        console.log(toDate);
        break;
      default:
        break;
    }
  };

  // set month by either one of the four seasons to date variables
  const setDateSeason = (season) => {
    switch (season) {
      // winter from date
      case "from winter":
        // set last two numbers to 12-01
        fromDate = fromDate.slice(0, 4) + "-12-01";
        break;
      // winter to date
      case "to winter":
        // set month to december
        toDate = toDate.slice(0, 4) + "-12-01";
        break;
      case "from spring":
        // set month to march
        fromDate = fromDate.slice(0, 4) + "-03-01";
        break;
      case "to spring":
        // set month to march
        toDate = toDate.slice(0, 4) + "-03-01";
        break;
      case "from summer":
        // set month to june
        fromDate = fromDate.slice(0, 4) + "-06-01";
        break;
      case "to summer":
        // set month to june
        toDate = toDate.slice(0, 4) + "-06-01";
        break;
      case "from fall":
        // set month to september
        fromDate = fromDate.slice(0, 4) + "-09-01";
        break;
      case "to fall":
        // set month to september
        toDate = toDate.slice(0, 4) + "-09-01";
        break;
    }
  };

  // sort button array like genres
  const sortBtns = [
    {
      name: "Most popular",
      value: "popularity",
    },
    {
      name: "Best rated",
      value: "score&sort=desc",
    },
    {
      name: "Oldest anime",
      value: "start_date",
    },
    {
      name: "Newest anime",
      value: "start_date&sort=desc",
    },
  ];

  // selected sort button
  let selectedSortBtn = "";

  // set selected sort button
  const setSortBtn = (sortBtn) => {
    selectedSortBtn = sortBtn;
  };

  // anime data variable
  let animeData = [];

  // pagination data variable
  let paginationData = [];

  // completed, airing, upcoming variable as object array with title and value
  const status = [
    {
      title: "Completed anime",
      value: "complete",
    },
    {
      title: "Airing anime",
      value: "airing",
    },
    {
      title: "Upcoming anime",
      value: "upcoming",
    },
  ];

  let selectedStatus = "";

  // set status function with value parameter
  const setStatus = (value) => {
    // if already selected, remove it
    if (selectedStatus === value) {
      selectedStatus = "";
    } else {
      selectedStatus = value;
    }
  };

  // is loading variable
  let isLoading = false;

  // fetch anime with jikan api
  const fetchAnime = async () => {
    const url = `https://api.jikan.moe/v4/anime?sfw=true${
      selectedRating > 0 ? `&min_score=${selectedRating}` : ""
    }${selectedGenres.length > 0 ? `&genres=${selectedGenres}` : ""}${
      selectedExcludeGenres.length > 0
        ? `&genres_exclude=${selectedExcludeGenres}`
        : ""
    }&type=${selectedAnimeType}&status=${
      status ? selectedStatus : ""
    }&start_date=${fromDate}&order_by=${selectedSortBtn}&page=${currentPage}`;
    // create a try catch block to catch errors
    try {
      isLoading = true;
      // create a variable to store the response
      const response = await fetch(url).then((res) => res.json());
      // set response to animeData
      // scroll to bottom of page if #results does not exist
      if (!document.querySelector("#results")) {
        window.scrollTo(0, document.body.scrollHeight);
      }

      setTimeout(() => {
        isLoading = false;
        animeData = response.data;
      }, 980);

      paginationData = response.pagination;
      console.log(url);
      console.log(animeData);
      noResults = true;
      // scroll to #results after 400ms
      setTimeout(() => {
        window.scrollTo({
          top: document.getElementById("results").offsetTop,
          behavior: "smooth",
        });
      }, 1000);
    } catch (error) {
      paginationData = [];
      noResults = true;
      animeData = [];
      console.log(error);
    }
  };
</script>

<div
  class="p-6 text-neutral-200 bg-neutral-900 w-full h-full min-h-screen flex justify-center flex-col items-center"
>
  <div class="max-w-7xl w-full flex flex-col items-center">
    <header class="w-full">
      <div
        class=" flex justify-center flex-col items-center text-center mb-6 w-full"
      >
        <img width="600" src="/assets/logo.svg" alt="" />
        <p class="mt-6 max-w-2xl">
          NeedAni.me makes it easy for you to find a new anime you want to watch
          by using <a
            class=" font-bold underline-offset-2 hover:underline"
            href="https://jikan.moe/"
            target="_blank">Jikan's API</a
          >. New Features will be added by time, so don't forget to bookmark it!
        </p>
      </div>
      <!-- Divider -->
      <div class="absolute right-0 left-0 border-b border-neutral-50" />
    </header>
    <div class="flex text-neutral-100 text-center flex-col mt-12 w-full">
      <div class="flex-col w-full flex">
        <h2 class="text-3xl font-bold">
          <!-- if not selectedRating is not 0 -->
          Score of:
          {selectedRating > 0 ? selectedRating + " - 10" : "0 - 10"}
        </h2>
        <!-- button group from 1 to 10, with each scoreRating. All buttons in one line -->
        <div
          class="mt-6 w-full flex flex-wrap max-sm:gap-2 justify-stretch gap-1"
        >
          {#each scoreRating as score}
            <button
              class="active:bg-neutral-900 min-w-[48px]  flex  items-center justify-center px-5 py-3 hover:bg-neutral-700  flex-grow {score >=
                selectedRating && selectedRating !== 0
                ? ' bg-neutral-800 outline outline-1'
                : ' bg-neutral-500'}"
              on:click={() => {
                setRating(score);
              }}
            >
              {score}
            </button>
          {/each}
        </div>
      </div>
      <div class="flex-col w-full flex mt-12">
        <h2 class="text-3xl font-bold">What are you interested in?</h2>
        <div class="mt-6 w-full flex">
          <div
            class="w-full gap-1 grid grid-flow-col auto-cols-fr max-sm:flex max-sm:flex-col max-sm:gap-2"
          >
            <div class="flex flex-col items-center">
              <!-- helper text -->
              <p class="text-neutral-200">
                <span
                  class="p-0 align-center px-1 pb-[2px] font-black rounded bg-neutral-700 text-green-500"
                  >+</span
                >
                Select genres you want to
                <strong>include</strong>
              </p>
              <button
                class="active:bg-neutral-900 mt-4 flex  items-baseline justify-center px-5 py-3  rounded hover:bg-neutral-800 bg-neutral-700  flex-grow"
                on:click={() => {
                  toggleIncludeBtn();
                  console.log("Inlcuded Genre", selectedGenres);
                }}
              >
                {!clickedIncludeBtn ? "Include all" : "Uncheck all"}
              </button>
            </div>

            <!-- exclude all button -->
            <div class="max-sm:mt-3 flex flex-col items-center">
              <!-- helper text -->
              <p class="text-neutral-200">
                <span
                  class="p-0 align-center px-1 pb-[2px] font-black rounded bg-neutral-700 text-red-500"
                  >−</span
                >
                Select genres you want to
                <strong>exclude</strong>
              </p>
              <button
                class="active:bg-neutral-900 mt-4 flex  items-baseline justify-center px-5 py-3 rounded hover:bg-neutral-800 bg-neutral-700  flex-grow"
                on:click={() => {
                  toggleExcludeBtn();
                  console.log("Ecluded Genre", selectedExcludeGenres);
                }}
              >
                {!clickedExcludeBtn ? "Exclude all" : "Uncheck all"}
              </button>
            </div>
          </div>
          <!-- include all button -->
        </div>

        {#each genres as genreGroup}
          <div
            class="mt-6 max-sm:gap-2 gap-1 lg:grid-flow-col grid-container grid lg:grid lg:auto-cols-fr "
          >
            <!-- each genreGroup as genre and id -->
            {#each genreGroup as genre}
              {#each Object.entries(genre) as [name, id]}
                <div class="relative flex flex-row items-center">
                  <div
                    bind:this={genreButton}
                    class="relative genreButton rounded text-center  active:bg-neutral-900 px-5 py-3 w-full hover:bg-neutral-700 {selectedGenres.includes(
                      id
                    ) || selectedExcludeGenres.includes(id)
                      ? ' bg-neutral-800'
                      : ' bg-neutral-500'}
                      {selectedExcludeGenres.includes(id)
                      ? ' outline-red-300 outline outline-1'
                      : ''} 
                        {selectedGenres.includes(id)
                      ? ' outline-green-200 outline outline-1'
                      : ''}
                      "
                  >
                    <!-- <span
                      class="p-0 align-center px-1 pb-[2px] font-black rounded bg-neutral-700 text-green-500 {selectedGenres.includes(
                        id
                      )
                        ? ''
                        : ' hidden'}"
                      >{selectedGenres.includes(id) ? "+" : ""}
                    </span>
                    <span
                      class="p-0 align-center px-1 pb-[2px] font-black rounded bg-neutral-700 text-red-500 {selectedExcludeGenres.includes(
                        id
                      )
                        ? ''
                        : ' hidden'}"
                      >{selectedExcludeGenres.includes(id) ? "−" : ""}
                    </span> -->
                    {name.replace(/_/g, " ")}
                    <!-- right half of the div, create a button which indicates and add button -->
                    <button
                      class="active:bg-neutral-900 items-center flex justify-center absolute rounded top-0 bottom-0 right-0  w-1/2  {selectedGenres.includes(
                        id
                      )
                        ? ' bg-green-500/10 hover:bg-neutral-800/80'
                        : ' hover:bg-green-500/50'}"
                      on:click={() => {
                        addGenre(id);
                        console.log("Included Genre", selectedGenres);
                      }}
                    >
                      <!-- show + if it is not selected otherwise show a cross -->
                      <span class="font-bold">
                        {selectedGenres.includes(id) ? "×" : "+"}
                      </span>
                    </button>
                    <!-- left half of the div, create a button which indicates and add button -->
                    <button
                      class="active:bg-neutral-900 items-center flex justify-center absolute rounded top-0 bottom-0 left-0  w-1/2  {selectedExcludeGenres.includes(
                        id
                      )
                        ? ' bg-red-500/10 hover:bg-neutral-800/80'
                        : ' hover:bg-red-500/50'}"
                      on:click={() => {
                        addExcludeGenre(id);
                        console.log("Ecluded Genre", selectedExcludeGenres);
                      }}
                    >
                      <!-- show + if it is not selected otherwise show a cross -->
                      <span class="font-bold">
                        {selectedExcludeGenres.includes(id) ? "×" : "−"}
                      </span>
                    </button>
                  </div>
                </div>
              {/each}
            {/each}
          </div>
        {/each}
      </div>
      <div class="flex-col w-full flex mt-12">
        <h2 class="text-3xl font-bold">Type of Anime</h2>
        <div
          class="mt-6 md:grid-flow-col grid-container md:grid md:auto-cols-fr max-sm:gap-2 gap-1"
        >
          {#each animeType as type}
            <button
              class=" active:bg-neutral-900 px-5 py-3  w-full   hover:bg-neutral-700   {selectedAnimeType.includes(
                type.toLowerCase()
              )
                ? ' bg-neutral-800 outline outline-1'
                : ' bg-neutral-500'}"
              on:click={() => {
                setAnimeType(type.toLowerCase());
                console.log(selectedAnimeType);
              }}
            >
              {type}
            </button>
          {/each}
        </div>
      </div>
      <div class="flex-col w-full flex mt-12">
        <h2 class="text-3xl font-bold">Release Date</h2>
        <div class="mt-6 md:grid-flow-col md:grid md:auto-cols-fr ">
          <!-- "From date as number input to change year -->
          <div
            class="grid auto-cols-fr grid-flow-col text-center relative  w-full "
          >
            <!-- decrease btn -->
            <div class="flex flex-col">
              <div class="grid max-sm:gap-2 auto-cols-fr grid-flow-col gap-1">
                <!-- fromDateNums as buttons like the season buttons but with setDateYear -->
                {#each fromDateNums as num}
                  <button
                    class=" active:bg-neutral-900 p-2  w-full   hover:bg-neutral-800 bg-neutral-700"
                    on:click={() => {
                      increaseDate("from", num);
                      console.log(fromDate, toDate);
                    }}
                  >
                    {num < 0 ? num.toString().replace("-", "−") : "+" + num}
                  </button>
                {/each}
              </div>
              <div
                class="grid max-sm:gap-2 auto-cols-fr grid-flow-col gap-1 mt-4"
              >
                <button
                  title="Decrease year"
                  class="active:bg-neutral-900 px-3 bg-neutral-700 h-full justify-center hover:bg-neutral-800 font-bold "
                  on:click={() => {
                    increaseDate("from", -1);
                  }}
                >
                  −
                </button>
                <input
                  title="You can also type in the year"
                  type="number"
                  class="px-2 focus-within:scale-110 outline-none font-bold text-xl tabular-nums py-3 text-center bg-neutral-800  "
                  value={fromDate.split("-")[0]}
                  on:input={(e) => {
                    setDateYear("from", e.target.value);
                  }}
                />
                <button
                  title="Increase year"
                  class="pt-[2px] pb-[6px] px-3 bg-neutral-700 active:bg-neutral-900 h-full justify-center hover:bg-neutral-800 font-bold "
                  on:click={() => {
                    increaseDate("from", 1);
                    console.log(fromDate.split("-")[1]);
                  }}
                >
                  +
                </button>
              </div>
              <!-- season button with emoji as text and setDateSeason -->
              <div
                class="grid max-sm:gap-2 mt-2 auto-cols-fr grid-flow-col gap-1"
              >
                <button
                  title="set season to winter"
                  class="flex items-center justify-center p-2   h-full hover:bg-neutral-700 {fromDate.split(
                    '-'
                  )[1] === '12' ||
                  fromDate.split('-')[1] === '02' ||
                  fromDate.split('-')[1] === '01'
                    ? ' bg-neutral-800 outline outline-1'
                    : ' bg-neutral-500'}"
                  on:click={() => {
                    setDateSeason("from winter");
                  }}
                >
                  <!-- if above 518px window width show "season" -->
                  {window.innerWidth > 518 ? "Winter ❄️" : "❄️"}
                </button>
                <button
                  title="set season to spring"
                  class="flex items-center justify-center p-2   h-full hover:bg-neutral-700 {fromDate.split(
                    '-'
                  )[1] === '03' ||
                  fromDate.split('-')[1] === '04' ||
                  fromDate.split('-')[1] === '05'
                    ? ' bg-neutral-800 outline outline-1'
                    : ' bg-neutral-500'}"
                  on:click={() => {
                    setDateSeason("from spring");
                  }}
                >
                  <!-- if above 518px window width show "season" -->
                  {window.innerWidth > 518 ? "Spring 🌷" : "🌷"}
                </button>
                <button
                  title="set season to summer"
                  class="flex items-center justify-center p-2    h-full hover:bg-neutral-700 {fromDate.split(
                    '-'
                  )[1] === '06' ||
                  fromDate.split('-')[1] === '07' ||
                  fromDate.split('-')[1] === '08'
                    ? ' bg-neutral-800 outline outline-1'
                    : ' bg-neutral-500'}"
                  on:click={() => {
                    setDateSeason("from summer");
                  }}
                >
                  <!-- if above 518px window width show "season" -->
                  {window.innerWidth > 518 ? "Summer 🌞" : "🌞"}
                </button>
                <button
                  title="set season to autumn/fall"
                  class="flex items-center justify-center p-2      h-full hover:bg-neutral-700 {fromDate.split(
                    '-'
                  )[1] === '09' ||
                  fromDate.split('-')[1] === '10' ||
                  fromDate.split('-')[1] === '11'
                    ? ' bg-neutral-800 outline outline-1'
                    : ' bg-neutral-500'}"
                  on:click={() => {
                    setDateSeason("from fall");
                  }}
                >
                  <!-- if above 518px window width show "season" -->
                  {window.innerWidth > 518 ? "Fall 🍂" : "🍂"}
                </button>
              </div>
            </div>
          </div>
          <!-- arrow right svg -->
          <!-- <div
            class="flex flex-row items-center justify-center text-center relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              class="relative top-5"
            >
              <g fill="#e5e5e5">
                <path
                  d="M32.121,9.293a1,1,0,0,0-1.414,0l-1.414,1.414a1,1,0,0,0,0,1.414L39.172,22H3a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H39.172l-9.879,9.879a1,1,0,0,0,0,1.414l1.414,1.414a1,1,0,0,0,1.414,0l14-14a1,1,0,0,0,0-1.414Z"
                  fill="#e5e5e5"
                />
              </g>
            </svg>
          </div> -->
          <!-- <div
            class="grid auto-cols-fr grid-flow-col text-center relative  w-full "
          >
            <div class="flex flex-col">
              // set to date to current Date button
              <button
                title="ml-3 set to current date"
                class="active:bg-neutral-900 text-base pt-[2px] pb-[6px] px-3    h-full justify-center hover:bg-neutral-700 {toDate ===
                new Date().toISOString().split('T')[0]
                  ? ' bg-neutral-800 outline outline-1'
                  : ' bg-neutral-500'}"
                on:click={() => {
                  // set toDate with ISO 8601 format
                  toDate = new Date().toISOString().split("T")[0];
                  console.log(toDate);
                }}
              >
                Set on today
              </button>
              <div class="grid auto-cols-fr grid-flow-col mb-1 mt-6">
                <button
                  title="Decrease year"
                  class="active:bg-neutral-900 pt-[2px] pb-[6px] px-3    h-full justify-center hover:bg-neutral-700  "
                  on:click={() => {
                    increaseDate("to", -1);
                  }}
                >
                  −
                </button>
                <input
                  title="You can also type in the year"
                  type="number"
                  class="px-2 py-2 font-bold text-xl leading-5 text-center  bg-neutral-800  "
                  value={toDate.split("-")[0]}
                  on:input={(e) => {
                    setDateYear("to", e.target.value);
                  }}
                />
                <button
                  title="Increase year"
                  class="active:bg-neutral-900 pt-[2px] pb-[6px] px-3     h-full justify-center hover:bg-neutral-700 "
                  on:click={() => {
                    // only if the year is not the current year
                    if (
                      toDate.split("-")[0] !==
                      new Date().getFullYear().toString()
                    ) {
                      increaseDate("to", 1);
                    }
                    console.log(toDate);
                  }}
                >
                  +
                </button>
              </div>
              // season button with emoji as text and setDateSeason
              <div class="grid auto-cols-fr grid-flow-col">
                <button
                  title="set season to winter"
                  class="flex items-center justify-center p-0 py-1 px-2   h-full hover:bg-neutral-700 {toDate.split(
                    '-'
                  )[1] === '12' ||
                  toDate.split('-')[1] === '02' ||
                  toDate.split('-')[1] === '01'
                    ? ' bg-neutral-800 outline outline-1'
                    : ' bg-neutral-500'}"
                  on:click={() => {
                    setDateSeason("to winter");
                  }}
                >
                  ❄️
                </button>
                <button
                  title="set season to spring"
                  class="flex items-center justify-center p-0 py-1 px-2   h-full hover:bg-neutral-700 {toDate.split(
                    '-'
                  )[1] === '03' ||
                  toDate.split('-')[1] === '04' ||
                  toDate.split('-')[1] === '05'
                    ? ' bg-neutral-800 outline outline-1'
                    : ' bg-neutral-500'}"
                  on:click={() => {
                    setDateSeason("to spring");
                  }}
                >
                  🌷
                </button>
                <button
                  title="set season to summer"
                  class="flex items-center justify-center p-0 py-1 px-2    h-full hover:bg-neutral-700 {toDate.split(
                    '-'
                  )[1] === '06' ||
                  toDate.split('-')[1] === '07' ||
                  toDate.split('-')[1] === '08'
                    ? ' bg-neutral-800 outline outline-1'
                    : ' bg-neutral-500'}"
                  on:click={() => {
                    setDateSeason("to summer");
                  }}
                >
                  🌞
                </button>
                <button
                  title="set season to autumn/fall"
                  class="flex items-center justify-center p-0 py-1 px-2    h-full hover:bg-neutral-700 {toDate.split(
                    '-'
                  )[1] === '09' ||
                  toDate.split('-')[1] === '10' ||
                  toDate.split('-')[1] === '11'
                    ? ' bg-neutral-800 outline outline-1'
                    : ' bg-neutral-500'}"
                  on:click={() => {
                    setDateSeason("to fall");
                  }}
                >
                  🍂
                </button>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <!-- set status buttons -->
      <h2 class="mt-12 text-3xl font-bold">Status</h2>
      <div
        class="mt-6 md:grid-flow-col grid-container md:grid md:auto-cols-fr max-sm:gap-2 gap-1 "
      >
        {#each status as { title, value }}
          <button
            title="set status to {title}"
            class=" active:bg-neutral-900 px-5 py-3  w-full   hover:bg-neutral-700  bg-neutral-800 {value ===
            selectedStatus
              ? ' bg-neutral-800 outline outline-1'
              : ' bg-neutral-500'}"
            on:click={() => {
              setStatus(value);
            }}
          >
            {title}
          </button>
        {/each}
      </div>

      <h2 class="text-3xl font-bold mt-12">Sort By</h2>
      <!-- sort buttons -->
      <div
        class="mt-6 md:grid-flow-col grid-container md:grid md:auto-cols-fr max-sm:gap-2 gap-1 "
      >
        {#each sortBtns as sortBtn}
          <button
            title="sort by {sortBtn.name}"
            class=" active:bg-neutral-900 px-5 py-3  w-full   hover:bg-neutral-700   bg-neutral-800 {sortBtn.value ===
            selectedSortBtn
              ? ' bg-neutral-800 outline outline-1'
              : ' bg-neutral-500'}"
            on:click={() => {
              setSortBtn(sortBtn.value);
              console.log(selectedSortBtn);
            }}
          >
            {sortBtn.name}
          </button>
        {/each}
      </div>
      <!-- "Show me!" fetch Button -->
      <div class="flex mt-24 mt- justify-center items-center" id="results">
        <button
          title="Show results"
          class="rounded transition-all duration-300 font-bold text-lg px-5 py-3  hover:shadow-[0px_0px_37px_1px_rgba(243,1,117,1)] shadow-[0px_0px_27px_1px_rgba(243,1,117,0.76)] bg-[#f30175]"
          on:click={() => {
            fetchAnime();
            // scroll to #results
            window.scrollTo({
              top: document.getElementById("results").offsetTop,
              behavior: "smooth",
            });
          }}
        >
          <svg
            class={isLoading ? "inline-block" : "hidden"}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g fill="#fafafa">
              <g class="nc-loop-dots-24-icon-f">
                <circle cx="4" cy="12" fill="#fafafa" r="3" />
                <circle cx="12" cy="12" r="3" />
                <circle cx="20" cy="12" fill="#fafafa" r="3" />
              </g>
              <style>
                .nc-loop-dots-24-icon-f {
                  --animation-duration: 1s;
                }
                .nc-loop-dots-24-icon-f * {
                  opacity: 0.4;
                  transform: scale(0.7);
                }
                .nc-loop-dots-24-icon-f :nth-child(1),
                .nc-loop-dots-24-icon-f :nth-child(3) {
                  animation: nc-loop-dots-anim-2b var(--animation-duration)
                    infinite linear;
                }
                .nc-loop-dots-24-icon-f :nth-child(1) {
                  transform-origin: 4px 12px;
                }
                .nc-loop-dots-24-icon-f :nth-child(2) {
                  animation: nc-loop-dots-anim-1b
                    calc(var(--animation-duration) / 2) infinite linear;
                  animation-delay: calc(var(--animation-duration) / 4);
                  transform-origin: 12px 12px;
                }
                .nc-loop-dots-24-icon-f :nth-child(3) {
                  animation-delay: calc(var(--animation-duration) / 2);
                  transform-origin: 20px 12px;
                }
                @keyframes nc-loop-dots-anim-1b {
                  0%,
                  100% {
                    opacity: 0.4;
                    transform: scale(0.7);
                  }
                  50% {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
                @keyframes nc-loop-dots-anim-2b {
                  0%,
                  100%,
                  66% {
                    opacity: 0.4;
                    transform: scale(0.7);
                  }
                  33% {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              </style>
            </g>
          </svg>
          {!isLoading ? "Show me!" : ""}
        </button>
      </div>
    </div>
    <!-- card wrapper -->
    {#if animeData.length > 0}
      <h2 class="mt-12 mb-3 text-2xl font-bold">Results</h2>
    {/if}
    {#if animeData.length === 0 && noResults}
      <div class="mt-12 flex justify-center items-center">
        <h2 class="text-2xl font-bold">No results found</h2>
      </div>
    {/if}
    <!-- {#if isLoading}
      <div class="flex justify-center h-[500px] items-center">
        <ContentLoader>
          <rect x="0" y="0" rx="0" ry="0" width="350" height="500" />
        </ContentLoader>
      </div>
    {/if} -->
  </div>
  <div
    class="max-w-[1800px] card-wrapper gap-4 flex justify-center flex-wrap 2xl:px-3 w-full"
  >
    {#each animeData as anime}
      <!-- card div -->
      <div
        class="flex overflow-hidden card h-fit 2xl:w-[calc(16.66667%_-_16px)] xl:w-[calc(25%_-_16px)] lg:w-[calc(33.33333%_-_16px)] w-[calc(50%_-_16px)] max-sm:w-full bg-neutral-800 flex-col border rounded-lg border-neutral-500 min-w-[250px]"
      >
        <!-- top container -->
        <div class="flex items-center justify-center h-72 relative">
          <!-- div box with position absolute and background gradient from top(black) to bottom(transparent) and a arrow in the center -->
          <img
            class="h-full w-full object-cover"
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
          />
          <!-- title and tags container starting from bottom with absolute position and dark background gradient -->
          <div
            class="absolute top-0 w-full flex justify-center flex-col leading-none rounded-lg overflow-hidden"
          >
            <div
              class="hidden flex-wrap w-full bg-zinc-900 border-b border-neutral-500"
            >
              <div
                class="flex items-start justify-start border-r border-neutral-500 w-1/2 p-2"
              >
                <img src="/assets/calendar.svg" alt="" class="mr-2" />
                <!-- get first whole word with splice method -->
                {#if anime.year !== null}
                  {anime.year}
                {:else}
                  {anime.aired.from.split("-")[0]}
                {/if}
              </div>
              <div class="flex items-start justify-start w-1/2 p-2">
                <img src="/assets/cinema.svg" alt="" class="mr-2" />{anime.type}
              </div>
              <div
                class="flex items-start justify-start border-t border-neutral-500 border-r w-1/2 p-2"
              >
                <img src="/assets/statistics.svg" alt="" class="mr-2" />
                {#if anime.score !== null}
                  {anime.score}
                {:else}
                  not yet given
                {/if}
              </div>
              <div
                class="flex items-start justify-start w-1/2 p-2 border-t border-neutral-500"
              >
                <img src="/assets/multiple.svg" alt="" class="mr-2" />
                {#if anime.popularity !== 0}
                  {anime.popularity}.
                {:else}
                  not placed yet
                {/if}
              </div>
            </div>
            <div
              class="w-full p-3 cursor-pointer transition-all duration-300 hover:bg-zinc-800 flex justify-center bg-gradient-to-t from-neutral-900/0 rotate to-neutral-900"
              on:click={(e) => {
                e.target.previousElementSibling.classList.toggle("hidden");
                e.target.previousElementSibling.classList.toggle("flex");
                e.target
                  .querySelector("svg")
                  .classList.toggle("!rotate-[270deg]");
              }}
            >
              <svg
                class="transition-all rotate-90 duration-300 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  fill="none"
                  stroke="#f5f5f5"
                >
                  <polyline
                    points="10,8 14,12 10,16 "
                    transform="translate(0, 0)"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 w-full h-3/5 bg-gradient-to-b from-neutral-900/0 to-neutral-900"
          >
            <div
              class="flex p-3 pr-[1px] flex-col items-start justify-end h-full"
            >
              <!-- <div
                  class="absolute h-[22px] bottom-3 right-[1px] w-1/4 pointer-events-none bg-gradient-to-l from-neutral-900
                to-neutral-900/0 z-10"
                /> -->
              <h1 class=" text-xl text-left font-bold pr-3">
                <!-- <span
                    class={anime.status === "Finished Airing"
                      ? "text-green-500"
                      : ""}
                  >
                    ‒
                  </span> -->
                {anime.title}
              </h1>
              <div
                class="mt-2 w-full relative
                  sm:hover:overflow-x-auto sm:overflow-hidden flex items-start justify-start mask-tags pr-14"
              >
                {#each anime.genres as genre}
                  <span class="mr-1 last:mr-0 text-xs leading-3 p-1 border">
                    {genre.name}
                  </span>
                {/each}
              </div>
            </div>
          </div>
        </div>
        <div class="bg-neutral-800">
          <Accordion>
            <AccordionItem>
              <div
                slot="title"
                class="p-3 pt-2 flex items-center  cursor-pointer hover:bg-neutral-700 active:bg-neutral-900"
                on:click={(e) => {
                  e.target
                    .querySelector(".arrow")
                    .classList.toggle("rotate-90");
                }}
              >
                <h2 class="text-md pointer-events-none">Synposis</h2>
                <svg
                  class="arrow ml-1 relative top-[2px] transition-all duration-300 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    fill="none"
                    stroke="#f5f5f5"
                  >
                    <polyline
                      points="10,8 14,12 10,16 "
                      transform="translate(0, 0)"
                    />
                  </g>
                </svg>
              </div>
              <div slot="content">
                <p class="px-3 mt-6 clamp text-ellipsis pb-3">
                  <!-- limit 50 words on anime.synopsis -->
                  {#if anime.synopsis}
                    {anime.synopsis.split(" ").slice(0, 50).join(" ")}...
                  {/if}
                  {#if !anime.synopsis}
                    No synopsis available
                  {/if}
                </p>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
        <!-- button like anime type button -->
        <div class="flex justify-center items-center">
          <a href={anime.url} target="_blank" class="w-full">
            <button
              title="For more information click here"
              class="flex justify-center items-center transition-all duration-300 bg-neutral-900 w-full py-3 hover:bg-neutral-700"
            >
              Go to MyAnimeList
              <svg
                class="ml-2"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M14 3L5.99998 11"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.49998 3H14V8.5"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11 11V14H3V6H6.5"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </a>
        </div>
      </div>
    {/each}
    {#if paginationData.has_next_page}
      <div class="flex justify-center items-center w-full">
        <!-- previous page button -->
        <button
          disabled={currentPage === 1 ? "true" : undefined}
          class="w-full py-3  h-full flex bg-neutral-800
            justify-center items-center hover:bg-neutral-700"
          on:click={() => {
            // decrease current page number by 1 and fetch anime
            currentPage--;
            fetchAnime();
            // scroll to #results
            window.scrollTo({
              top: document.querySelector("#results").offsetTop,
              behavior: "smooth",
            });
          }}
        >
          Previous Page
        </button>

        <!-- current page number -->
        <p class="font-bold mx-3 whitespace-nowrap">
          Current Page: {paginationData.current_page}
        </p>

        <!-- next page button -->
        <button
          class="w-full py-3 bg-neutral-800  h-full flex justify-center items-center hover:bg-neutral-700"
          on:click={() => {
            // increment currentPage by 1 and fetch anime
            currentPage++;
            fetchAnime();
            // scroll to #results
            window.scrollTo({
              top: document.querySelector("#results").offsetTop,
              behavior: "smooth",
            });
          }}
        >
          Next page
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .mt-6 > button,
  .mt-2 > button,
  .auto-cols-fr > button,
  .mt-4 input,
  .genreButton > * {
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  .mask-tags {
    mask-image: linear-gradient(to left, rgba(0, 0, 0, 0) 5%, rgb(0, 0, 0) 30%);
    -webkit-mask-image: linear-gradient(
      to left,
      rgba(0, 0, 0, 0) 5%,
      rgb(0, 0, 0) 30%
    );
    white-space: nowrap;
  }

  .card-wrapper {
    opacity: 1;
    gap: 1rem !important;
  }
  .card-wrapper:hover > .card {
    opacity: 0.7;
  }
  .card {
    transition: all 0.3s ease-in-out;
    border-radius: 8px;
    gap: 0 !important;
  }
  .card-wrapper:hover > .card:hover {
    opacity: 1;
    transform: scale(1.1);
    position: relative;
    z-index: 20;
    box-shadow: black 0px 10px 30px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
