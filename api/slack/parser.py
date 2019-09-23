import argparse


class ArgumentParserError(Exception):
    pass


class SlackArgumentParser(argparse.ArgumentParser):
    def print_usage(self, file=None):
        self.exit(message=self.format_usage())

    def print_help(self, file=None):
        self.exit(message=self.format_help())

    def exit(self, status=0, message=""):
        raise ArgumentParserError(message)
