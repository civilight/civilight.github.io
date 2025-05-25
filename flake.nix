{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    flake-utils = {
      url = "github:numtide/flake-utils";
    };
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import inputs.nixpkgs {
        system = system;
      };
    in {
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.importNpmLock.hooks.linkNodeModulesHook

          pkgs.nodejs

          pkgs.nodePackages.prettier
          pkgs.nodePackages.svelte-language-server
          pkgs.nodePackages."@tailwindcss/language-server"

          pkgs.fish
        ];

        npmDeps = pkgs.importNpmLock.buildNodeModules {
          npmRoot = ./.;
          nodejs = pkgs.nodejs;
        };

        shellHook = ''
          fish # Objectively superior to Bash
          exit
        '';
      };
    });
}
