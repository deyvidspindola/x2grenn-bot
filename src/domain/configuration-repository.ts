export abstract class ConfigurationRepository {
  abstract setDiffGols(gameTime: number, diffGols: number): Promise<any>;
}
