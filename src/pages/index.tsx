import Image from "next/image";
import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HomeProps {
  agents: [Agent];
  randomMap: Map;
}
interface Agent {
  uuid: string;
  displayName: string;
  displayIcon: string;
  displayIconSmall: string;
  abilities: [AgentAbilities];
}

interface AgentAbilities {
  slot: string;
  displayName: string;
  description: string;
  displayIcon?: string;
}

interface Map {
  splash: string;
}

export default function Home({ agents, randomMap }: HomeProps) {
  const [agent, setAgent] = useState<Agent>();
  const [agentAbilities, setAgentAbilities] = useState<AgentAbilities>();
  const [startGame, setStartGame] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    localStorage.getItem("@ValorantGuess") != null &&
      setBestScore(parseInt(localStorage.getItem("@ValorantGuess")));
  }, []);

  function handleStartClick(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    const randomAgent = agents[Math.floor(Math.random() * (max - min) + min)];
    const abilities = randomAgent.abilities[Math.floor(Math.random() * 4)];

    setAgent(randomAgent);
    setAgentAbilities(abilities);
  }

  function CheckScore() {
    bestScore <= score && setBestScore(score + 1);

    localStorage.setItem("@ValorantGuess", JSON.stringify(bestScore + 1));
  }

  function CheckAgent() {
    selectedAgent == agent.displayName
      ? (setScore(score + 1), handleStartClick(0, agents.length), CheckScore())
      : (setStartGame(false), setScore(0));

    setSelectedAgent("");
  }

  return (
    <>
      <Head>
        <title>Valorant Guess</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-full flex justify-center items-center relative">
        <Image
          className="absolute w-full h-full filter z-0 blur-sm transform scale-110"
          src={randomMap.splash}
          alt="background image"
          layout="fill"
        />

        <div className="absolute top-2 flex flex-col md:flex-row md:gap-8 w-full md:justify-between px-2 md:px-9">
          <h1 className="text-white font-anton text-xl md:text-2xl">
            SCORE: {score}
          </h1>

          <h1 className="text-white font-anton text-xl md:text-2xl">
            BEST SCORE: {bestScore}
          </h1>
        </div>

        <section className="z-10 w-full h-full flex justify-center items-center">
          {startGame ? (
            <div className="flex flex-col justify-around items-center h-full">
              <motion.div
                key={agentAbilities.displayIcon}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeOut", duration: 1 }}
              >
                <Image
                  src={agentAbilities.displayIcon}
                  width={120}
                  height={120}
                  placeholder="blur"
                  blurDataURL="true"
                  priority={true}
                />
              </motion.div>

              <div className="flex flex-col items-center justify-center gap-4 md:gap-8">
                <motion.div
                  key={selectedAgent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ease: "easeOut", duration: 1 }}
                >
                  {selectedAgent != "" ? (
                    <h1 className="text-white font-bold">{selectedAgent}</h1>
                  ) : (
                    <h1 className="text-white font-bold">Select an agent</h1>
                  )}
                </motion.div>
                <button
                  className={`${
                    selectedAgent == ""
                      ? "cursor-not-allowed"
                      : "bg-green-400 hover:bg-green-300 transition"
                  }" py-3 px-12 text-2xl font-black text-gray-200 border border-gray-200"`}
                  onClick={CheckAgent}
                  type="button"
                  disabled={selectedAgent == ""}
                >
                  LOCK IN
                </button>

                <div className="grid md:grid-rows-2 grid-rows-4 grid-flow-col gap-1">
                  {agents.map((agent: Agent) => {
                    return (
                      <button
                        key={agent.uuid}
                        className={`${
                          selectedAgent == agent.displayName
                            ? "bg-opacity-30 bg-gray-100 brightness-110 filter border-2 border-yellow-200"
                            : "filter hover:brightness-110 hover:bg-gray-100 hover:bg-opacity-30 border border-gray-300"
                        } w-16 h-16 md:w-20 md:h-20`}
                        onClick={() => setSelectedAgent(agent.displayName)}
                      >
                        <Image
                          src={agent.displayIconSmall}
                          alt="Agent Icon"
                          width={80}
                          height={80}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <button
              className={`${
                startGame
                  ? "hidden"
                  : "bg-green-400 p-4 px-8 text-2xl font-black text-gray-200 border border-gray-200 hover:bg-green-300 transition"
              } `}
              onClick={() => {
                handleStartClick(0, agents.length);
                setStartGame(true);
              }}
            >
              START
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetch("https://valorant-api.com/v1/agents");
  const maps = await fetch("https://valorant-api.com/v1/maps");
  const response = await data.json();
  const mapResponse = await maps.json();

  const filterAgents = [
    ...response.data
      .reduce((map, obj) => map.set(obj.displayName, obj), new Map())
      .values(),
  ];

  const filteredAgents = filterAgents.sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );

  const filteredMap =
    mapResponse.data[
      Math.floor(Math.random() * (mapResponse.data.length - 0) + 0)
    ];

  return {
    props: {
      agents: filteredAgents,
      randomMap: filteredMap,
    },

    revalidate: 60 * 60 * 24, // 24 hours
  };
};
