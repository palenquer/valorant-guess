import Image from "next/image";
import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";

interface HomeProps {
  agents: [Agent];
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

export default function Home({ agents }: HomeProps) {
  const [agent, setAgent] = useState<Agent>();
  const [agentAbilities, setAgentAbilities] = useState<AgentAbilities>();
  const [startGame, setStartGame] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [check, setCheck] = useState(false);
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
      ? (setCheck(true),
        setScore(score + 1),
        handleStartClick(0, agents.length),
        CheckScore())
      : (setCheck(false), setStartGame(false), setScore(0));
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
          src={
            "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png"
          }
          alt="background image"
          layout="fill"
        />

        <div className="absolute top-2 right-2 flex gap-8">
          <h1 className="text-white font-anton">BEST SCORE: {bestScore}</h1>

          <h1 className="text-white font-anton">SCORE: {score}</h1>
        </div>

        <section className="z-10 w-full h-full flex justify-center items-center">
          {startGame ? (
            <div className="flex flex-col justify-around items-center h-full">
              <Image
                src={agentAbilities.displayIcon}
                width={120}
                height={120}
              />

              <div className="flex flex-col items-center justify-center gap-8">
                <button
                  className="bg-green-400 py-3 px-12 text-2xl font-black text-gray-200 border border-gray-200 hover:bg-green-300 transition"
                  onClick={CheckAgent}
                >
                  LOCK IN
                </button>

                <div className="grid grid-rows-2 grid-flow-col gap-1">
                  {agents.map((agent: Agent) => {
                    return (
                      <button
                        key={agent.uuid}
                        className={`${
                          selectedAgent == agent.displayName
                            ? "bg-opacity-30 bg-gray-100 brightness-110 filter"
                            : "filter hover:brightness-110 hover:bg-gray-100 hover:bg-opacity-30"
                        } border border-gray-300 w-20 h-20`}
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
  const response = await data.json();

  const filterAgents = [
    ...response.data
      .reduce((map, obj) => map.set(obj.displayName, obj), new Map())
      .values(),
  ];

  const filteredAgents = filterAgents.sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );

  return {
    props: {
      agents: filteredAgents,
    },

    revalidate: 60 * 60 * 24, // 24 hours
  };
};
