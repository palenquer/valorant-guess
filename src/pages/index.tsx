import axios from "axios";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import SkillGuess from "../components/SkillGuess";

interface Agent {
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

export default function Home() {
  const [agentList, setAgentList] = useState([]);
  const [agent, setAgent] = useState<Agent>();
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("https://valorant-api.com/v1/agents");
      setAgentList(result.data.data);
    };

    fetchData();
  }, []);

  function handleRandomAgent(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    let randomNumber = Math.floor(Math.random() * (max - min) + min);

    setAgent(agentList[randomNumber]);
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

        <section className="z-10 w-full h-full flex justify-center items-center">
          {startGame ? (
            <div>
              <Image
                src={agent.abilities[Math.floor(Math.random() * 4)].displayIcon}
                width={120}
                height={120}
              />

              <div>
                {agentList.map((agent: Agent) => {
                  return (
                    <Image
                      src={agent.displayIconSmall}
                      alt="Agent Icon"
                      width={80}
                      height={80}
                    />
                  );
                })}
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
                handleRandomAgent(0, agentList.length), setStartGame(true);
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
