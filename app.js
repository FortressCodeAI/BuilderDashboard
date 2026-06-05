/* ============================================================
   BaseLayerOS Builder Dashboard — Backend Connected Edition
      ============================================================ */

      const API = {
        base: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000",

          async get(path) {
              const res = await fetch(`${this.base}${path}`);
                  if (!res.ok) throw new Error(`GET ${path} failed`);
                      return res.json();
                        },

                          async post(path, body = {}) {
                              const res = await fetch(`${this.base}${path}`, {
                                    method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify(body)
                                                    });
                                                        if (!res.ok) throw new Error(`POST ${path} failed`);
                                                            return res.json();
                                                              }
                                                              };

                                                              /* ------------------------------------------------------------
                                                                 STATE ENGINE
                                                                    ------------------------------------------------------------ */
                                                                    const State = {
                                                                      modules: {},
                                                                        artifacts: [],
                                                                          activeArtifact: null,
                                                                            ui: {}
                                                                            };

                                                                            /* ------------------------------------------------------------
                                                                               EVENT BUS
                                                                                  ------------------------------------------------------------ */
                                                                                  const EventBus = {
                                                                                    listeners: {},
                                                                                      emit(event, payload) {
                                                                                          (this.listeners[event] || []).forEach(cb => cb(payload));
                                                                                            },
                                                                                              on(event, cb) {
                                                                                                  if (!this.listeners[event]) this.listeners[event] = [];
                                                                                                      this.listeners[event].push(cb);
                                                                                                        }
                                                                                                        };

                                                                                                        /* ------------------------------------------------------------
                                                                                                           ARTIFACT REGISTRY (Backend Connected)
                                                                                                              ------------------------------------------------------------ */
                                                                                                              const ArtifactRegistry = {
                                                                                                                async load() {
                                                                                                                    const data = await API.get("/artifacts");
                                                                                                                        State.artifacts = data;
                                                                                                                            EventBus.emit("artifactsLoaded", data);
                                                                                                                              },
                                                                                                                                get(id) {
                                                                                                                                    return State.artifacts.find(a => a.id === id);
                                                                                                                                      }
                                                                                                                                      };

                                                                                                                                      /* ------------------------------------------------------------
                                                                                                                                         MODULE REGISTRY (Backend Connected)
                                                                                                                                            ------------------------------------------------------------ */
                                                                                                                                            const ModuleRegistry = {
                                                                                                                                              async load(name) {
                                                                                                                                                  const module = await API.get(`/modules/${name}`);
                                                                                                                                                      State.modules[name] = module;
                                                                                                                                                          EventBus.emit("moduleLoaded", { name });
                                                                                                                                                            },
                                                                                                                                                              get(name) {
                                                                                                                                                                  return State.modules[name];
                                                                                                                                                                    }
                                                                                                                                                                    };

                                                                                                                                                                    /* ------------------------------------------------------------
                                                                                                                                                                       UI HYDRATION
                                                                                                                                                                          ------------------------------------------------------------ */
                                                                                                                                                                          function hydrateUI() {
                                                                                                                                                                            State.ui.artifactList = document.getElementById("artifact-list");

                                                                                                                                                                              EventBus.on("artifactsLoaded", artifacts => {
                                                                                                                                                                                  State.ui.artifactList.innerHTML = artifacts
                                                                                                                                                                                        .map(
                                                                                                                                                                                                a => `
                                                                                                                                                                                                      <div class="artifact-card" data-id="${a.id}">
                                                                                                                                                                                                              <h3>${a.name}</h3>
                                                                                                                                                                                                                      <p>${a.description}</p>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                `
                                                                                                                                                                                                                                      )
                                                                                                                                                                                                                                            .join("");

                                                                                                                                                                                                                                                document.querySelectorAll(".artifact-card").forEach(card => {
                                                                                                                                                                                                                                                      card.addEventListener("click", () => {
                                                                                                                                                                                                                                                              const id = card.getAttribute("data-id");
                                                                                                                                                                                                                                                                      const artifact = ArtifactRegistry.get(id);
                                                                                                                                                                                                                                                                              State.activeArtifact = artifact;

                                                                                                                                                                                                                                                                                      renderArtifact(artifact);
                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                  /* ------------------------------------------------------------
                                                                                                                                                                                                                                                                                                     ARTIFACT RENDERER
                                                                                                                                                                                                                                                                                                        ------------------------------------------------------------ */
                                                                                                                                                                                                                                                                                                        function renderArtifact(artifact) {
                                                                                                                                                                                                                                                                                                          document.getElementById("envelope").innerHTML = `
                                                                                                                                                                                                                                                                                                              <h2>${artifact.name}</h2>
                                                                                                                                                                                                                                                                                                                  <pre>${JSON.stringify(artifact.envelope, null, 2)}</pre>
                                                                                                                                                                                                                                                                                                                    `;
                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                    /* ------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                       INIT
                                                                                                                                                                                                                                                                                                                          ------------------------------------------------------------ */
                                                                                                                                                                                                                                                                                                                          async function init() {
                                                                                                                                                                                                                                                                                                                            hydrateUI();
                                                                                                                                                                                                                                                                                                                              await ArtifactRegistry.load();
                                                                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                                                                              init();